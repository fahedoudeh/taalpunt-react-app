import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} from "../../services/messageService";
import PostCard from "../../components/board/postCard/PostCard";
import PostForm from "../../components/board/postForm/PostForm";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import EmptyState from "../../components/ui/empty/EmptyState";
import Button from "../../components/ui/button/Button";
import Modal from "../../components/ui/modal/Modal";
import { sortByNewest } from "../../helpers/utils";

import "./Board.css";

export default function Board() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
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

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getMessages();
      const list = Array.isArray(data) ? data : [];
      const communityOnly = list.filter((m) => !m.teachersOnly);
      setMessages(sortByNewest(communityOnly));
    } catch (e) {
      if (e.code === "ECONNABORTED") {
        setError("De server reageert traag. Probeer het zo nog eens.");
      } else {
        setError("Kon berichten niet laden.");
      }
      console.error("Board fetch error:", e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmitPost = async (formData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const numericUserId = getNumericUserId();
      if (!numericUserId) {
        throw new Error("Geen geldige gebruiker gevonden.");
      }

      if (editingMessage) {
        const payload = {
          id: editingMessage.id,
          title: formData.title,
          content: formData.content,
          type: formData.type,
          tags: formData.tags,
          teachersOnly: false,
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
          teachersOnly: false,
          authorId: numericUserId,
          author: user?.email,
          createdAt: new Date().toISOString(),
        };

        const { data } = await createMessage(payload);
        setMessages((prev) => sortByNewest([data, ...prev]));
      }

      handleClosePostModal();
    } catch (e) {
      setError(
        editingMessage
          ? "Kon bericht niet bijwerken. Probeer het opnieuw."
          : "Kon bericht niet plaatsen. Probeer het opnieuw."
      );
      console.error("Board submit error:", e?.response?.data || e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (message) => {
    setDeleteTarget(message);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const id = deleteTarget.id;
    setError("");

    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (e) {
      setError("Kon bericht niet verwijderen. Probeer het opnieuw.");
      console.error("Board delete error:", e?.response?.data || e.message);
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <Loader label="Berichten laden..." />;

  return (
    <div className="board">
      <div className="board__header">
        <div>
          <h1 className="board__title">Community board</h1>
          <p className="board__subtitle">
            Deel tips, stel vragen en praat mee met andere cursisten.
          </p>
        </div>

        <Button variant="primary" onClick={openNewPostModal}>
          Nieuw bericht
        </Button>
      </div>

      {error && <ErrorNotice message={error} />}

      <div className="board__content">
        {messages.length === 0 ? (
          <EmptyState
            title="Nog geen berichten"
            message="Wees de eerste die iets deelt op het board."
            actionLabel="Eerste bericht plaatsen"
            onClick={openNewPostModal}
          />
        ) : (
          <div className="board__list">
            {messages.map((message) => {
              const numericUserId = getNumericUserId();
              const isOwner =
                numericUserId &&
                (message.authorId === numericUserId ||
                  message.userId === numericUserId);

              return (
                <PostCard
                  key={message.id}
                  message={message}
                  onEdit={() => handleEditMessage(message)}
                  onDelete={() => handleDeleteClick(message)}
                  canEdit={isOwner || user?.role === "admin"}
                  canDelete={isOwner || user?.role === "admin"}
                />
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={isPostModalOpen}
        title={editingMessage ? "Bericht bewerken" : "Nieuw bericht"}
        onCancel={handleClosePostModal}
        onConfirm={null}
      >
        <PostForm
          initialData={editingMessage}
          onSubmit={handleSubmitPost}
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
  );
}
