import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getTeacherMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} from "../../services/messageService";
import PostForm from "../../components/board/postForm/PostForm";
import PostCard from "../../components/board/postCard/PostCard";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import EmptyState from "../../components/ui/empty/EmptyState";
import Button from "../../components/ui/button/Button";
import "./TeachersBoard.css";

export default function TeachersBoard() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const getNumericUserId = () => {
    if (!user) return undefined;
    return Number(user.id ?? user.userId);
  };

  // Fetch teacher-only messages
  const fetchMessages = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await getTeacherMessages();
      setMessages(Array.isArray(data) ? data : []);
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

  useEffect(() => {
    fetchMessages();
  }, []);

  // Create / update teacher-only message
  const handleSubmitMessage = async (formData) => {
    setSubmitting(true);
    setError("");

    try {
      const numericUserId = getNumericUserId();
      if (!numericUserId) {
        throw new Error("Geen geldige gebruiker gevonden voor authorId.");
      }

      if (editingMessage) {
        const payload = {
          id: editingMessage.id, // required on PUT by your config
          title: formData.title,
          content: formData.content,
          type: formData.type,
          tags: formData.tags,
          teachersOnly: true, // 🔥 force teacher-only on this board
          authorId: editingMessage.authorId ?? numericUserId,
        };

        await updateMessage(editingMessage.id, payload);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === editingMessage.id
              ? { ...msg, ...payload, updatedAt: new Date().toISOString() }
              : msg
          )
        );
        setEditingMessage(null);
      } else {
        const payload = {
          title: formData.title,
          content: formData.content,
          type: formData.type,
          tags: formData.tags,
          teachersOnly: true, // 🔥 always true on teachers board
          authorId: numericUserId,
          author: user?.email,
          createdAt: new Date().toISOString(),
        };

        const { data } = await createMessage(payload);
        setMessages((prev) => [data, ...prev]);
      }

      setShowForm(false);
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
      setSubmitting(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Weet je zeker dat je dit bericht wilt verwijderen?"))
      return;

    setError("");
    try {
      await deleteMessage(messageId);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (e) {
      setError("Kon bericht niet verwijderen. Probeer het opnieuw.");
      console.error(
        "Teacher board delete error:",
        e?.response?.data || e.message
      );
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingMessage(null);
  };

  if (loading) return <Loader label="Docentenberichten laden..." />;

  return (
    <div className="teacher-board">
      <div className="teacher-board__header">
        <div>
          <h1 className="teacher-board__title">Docentenboard</h1>
          <p className="teacher-board__subtitle">
            Alleen zichtbaar voor docenten – interne aankondigingen, planning en
            notities.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} variant="primary">
            Nieuw docentenbericht
          </Button>
        )}
      </div>

      {error && <ErrorNotice message={error} />}

      {/* Message Form */}
      {showForm && (
        <div className="teacher-board__form-container">
          <PostForm
            initialData={
              editingMessage
                ? { ...editingMessage, teachersOnly: true }
                : { type: "Planning", teachersOnly: true }
            }
            onSubmit={handleSubmitMessage}
            onCancel={handleCancelForm}
            isSubmitting={submitting}
          />
        </div>
      )}

      {/* Messages List */}
      <div className="teacher-board__messages">
        {messages.length === 0 ? (
          <EmptyState
            title="Nog geen docentenberichten"
            message="Gebruik dit board om met collega’s af te stemmen."
            actionLabel="Eerste docentenbericht plaatsen"
            onClick={() => setShowForm(true)}
          />
        ) : (
          <div className="teacher-board__grid">
            {messages.map((message) => {
              const numericUserId = getNumericUserId();
              const isOwner =
                numericUserId &&
                (message.authorId === numericUserId ||
                  message.userId === numericUserId); // fallback if older data

              return (
                <PostCard
                  key={message.id}
                  message={message}
                  onEdit={() => handleEditMessage(message)}
                  onDelete={() => handleDeleteMessage(message.id)}
                  // Here I keep it strict: owner or admin
                  canEdit={isOwner || user?.role === "admin"}
                  canDelete={isOwner || user?.role === "admin"}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
