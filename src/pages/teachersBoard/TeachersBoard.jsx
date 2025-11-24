
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getTeacherMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} from "../../services/messageService";
import { getLikes } from "../../services/likeService";
import { getComments } from "../../services/commentService";
import PostForm from "../../components/board/postForm/PostForm";
import PostCard from "../../components/board/postCard/PostCard";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import EmptyState from "../../components/ui/empty/EmptyState";
import Button from "../../components/ui/button/Button";
import Modal from "../../components/ui/modal/Modal";
import { sortByNewest } from "../../helpers/utils";
import "./TeachersBoard.css";

export default function TeachersBoard() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [messagesWithSocial, setMessagesWithSocial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const getNumericUserId = () => {
    if (!user) return undefined;
    return Number(user.id ?? user.userId);
  };

  const fetchMessages = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await getTeacherMessages();
      const list = Array.isArray(data) ? data : [];
      setMessages(sortByNewest(list));

      // Fetch social data
      await fetchSocialData(list);
    } catch (e) {
      if (e.code === "ECONNABORTED") {
        setError("De server reageert traag. Probeer het zo nog eens.");
      } else if (e?.response?.status === 403 || e?.response?.status === 401) {
        setError("Geen toegang. Log in of controleer je rol.");
      } else {
        setError("Kon docentenberichten niet laden.");
      }
      console.error("Teacher messages error:", e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialData = async (messageList) => {
    try {
      // Fetch all likes and comments
      const [likesResponse, commentsResponse] = await Promise.all([
        getLikes(),
        getComments(),
      ]);

      const allLikes = likesResponse?.data || [];
      const allComments = commentsResponse?.data || [];

      // Attach likes and comments to each message
      const enriched = messageList.map((msg) => {
        const messageLikes = allLikes.filter(
          (like) => Number(like.messageId) === Number(msg.id)
        );
        const messageComments = allComments.filter(
          (comment) => Number(comment.messageId) === Number(msg.id)
        );

        return {
          ...msg,
          likes: messageLikes,
          comments: messageComments,
        };
      });

      // SORT BY NEWEST -
      setMessagesWithSocial(sortByNewest(enriched));
    } catch (e) {
      console.error("Error fetching social data:", e);
      
      setMessagesWithSocial(
        sortByNewest(
          messageList.map((msg) => ({ ...msg, likes: [], comments: [] }))
        )
      );
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openNewPostModal = () => {
    setEditingMessage(null);
    setIsPostModalOpen(true);
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
    setEditingMessage(null);
  };

  const handleSubmitMessage = async (formData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const numericUserId = getNumericUserId();
      if (!numericUserId) {
        throw new Error("Geen geldige gebruiker gevonden voor authorId.");
      }

      if (editingMessage) {
        const payload = {
          id: editingMessage.id,
          title: formData.title,
          content: formData.content,
          type: formData.type,
          tags: formData.tags,
          teachersOnly: true,
          authorId: editingMessage.authorId ?? numericUserId,
          author: editingMessage.author ?? user?.email,
        };

        await updateMessage(editingMessage.id, payload);

        setMessages((prev) =>
          sortByNewest(
            prev.map((msg) =>
              msg.id === editingMessage.id
                ? { ...msg, ...payload, updatedAt: new Date().toISOString() }
                : msg
            )
          )
        );
      } else {
        const payload = {
          title: formData.title,
          content: formData.content,
          type: formData.type,
          tags: formData.tags,
          teachersOnly: true,
          authorId: numericUserId,
          author: user?.email,
          createdAt: new Date().toISOString(),
        };

        const { data } = await createMessage(payload);
        setMessages((prev) => sortByNewest([data, ...prev]));
      }

      handleClosePostModal();
      // Refresh social data
      await fetchMessages();
    } catch (e) {
      setError(
        editingMessage
          ? "Kon docentenbericht niet bijwerken. Probeer het opnieuw."
          : "Kon docentenbericht niet plaatsen. Probeer het opnieuw."
      );
      console.error(
        "Teacher board submit error:",
        e?.response?.data || e.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (message) => {
    setDeleteTarget(message);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const messageId = deleteTarget.id;
    setError("");

    try {
      await deleteMessage(messageId);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      setMessagesWithSocial((prev) =>
        prev.filter((msg) => msg.id !== messageId)
      );
    } catch (e) {
      setError("Kon bericht niet verwijderen. Probeer het opnieuw.");
      console.error(
        "Teacher board delete error:",
        e?.response?.data || e.message
      );
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDataChange = async () => {
    // Refresh social data when likes/comments change
    await fetchSocialData(messages);
  };

  if (loading) return <Loader label="Docentenberichten laden..." />;

  return (
    <div className="teacher-board">
      <div className="teacher-board__inner">
        <div className="teacher-board__header">
          <div>
            <h1 className="teacher-board__title">Docentenboard</h1>
            <p className="teacher-board__subtitle">
              Alleen zichtbaar voor docenten – interne aankondigingen, planning
              en notities.
            </p>
          </div>
          <Button onClick={openNewPostModal} variant="primary">
            Nieuw docentenbericht
          </Button>
        </div>

        {error && <ErrorNotice message={error} />}

        <div className="teacher-board__messages">
          {messagesWithSocial.length === 0 ? (
            <EmptyState
              title="Nog geen docentenberichten"
              message="Gebruik dit board om met collega's af te stemmen."
              actionLabel="Eerste docentenbericht plaatsen"
              onClick={openNewPostModal}
            />
          ) : (
            <div className="teacher-board__grid">
              {messagesWithSocial.map((message) => {
                const numericUserId = getNumericUserId();
                const isOwner =
                  numericUserId &&
                  (message.authorId === numericUserId ||
                    message.userId === numericUserId);

                return (
                  <PostCard
                    key={message.id}
                    message={message}
                    likes={message.likes || []}
                    comments={message.comments || []}
                    onEdit={() => handleEditMessage(message)}
                    onDelete={() => handleDeleteClick(message)}
                    canEdit={isOwner || user?.roles?.includes("admin")}
                    canDelete={isOwner || user?.roles?.includes("admin")}
                    onDataChange={handleDataChange}
                  />
                );
              })}
            </div>
          )}
        </div>

        <Modal
          isOpen={isPostModalOpen}
          title={
            editingMessage
              ? "Docentenbericht bewerken"
              : "Nieuw docentenbericht"
          }
          onCancel={handleClosePostModal}
          onConfirm={null}
        >
          <PostForm
            initialData={
              editingMessage
                ? { ...editingMessage, teachersOnly: true }
                : { type: "Planning", teachersOnly: true }
            }
            onSubmit={handleSubmitMessage}
            onCancel={handleClosePostModal}
            isSubmitting={isSubmitting}
          />
        </Modal>

        <Modal
          isOpen={Boolean(deleteTarget)}
          title="Bericht verwijderen"
          message="Weet je zeker dat je dit bericht wilt verwijderen? Dit kan niet ongedaan worden gemaakt."
          confirmLabel="Ja, verwijderen"
          cancelLabel="Annuleren"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </div>
  );
}
