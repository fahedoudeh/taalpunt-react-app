
import { useState } from "react";
import { formatDate } from "../../../helpers/formatDate";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import IconButton from "../../ui/icons/IconButton";
import LikeButton from "../../social/LikeButton";
import InlineComments from "../../social/InlineComments";
import { Pencil, Trash2 } from "lucide-react";
import { createLike, deleteLike } from "../../../services/likeService";
import { createComment } from "../../../services/commentService";
import "./PostCard.css";

function PostCard({
  message,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  likes = [],
  comments = [],
  onDataChange,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);
  const [localComments, setLocalComments] = useState(comments);

  if (!message) return null;

  const title = message.title || message.subject || "Bericht";
  const content = message.body || message.content || message.text || "";
  const author =
    message.author ||
    message.username ||
    message.userEmail ||
    "Onbekende schrijver";

  const createdAt = message.createdAt || message.created_at;
  const updatedAt = message.updatedAt || message.updated_at;
  const hasBeenUpdated = Boolean(updatedAt && updatedAt !== createdAt);

  const handleCardClick = (e) => {
    // Don't navigate if clicking on interactive elements
    if (
      e.target.closest(".post-card__actions") ||
      e.target.closest(".like-button") ||
      e.target.closest(".inline-comments")
    ) {
      return;
    }
    navigate(`/board/${message.id}`);
  };

  const handleLikeChange = async (action, likeId) => {
    try {
      if (action === "like") {
        // Create like
        const payload = {
          messageId: Number(message.id),
          userId: Number(user.id),
          createdAt: new Date().toISOString(),
        };
        const response = await createLike(payload);
        const newLike = response.data;

        setLocalLikes((prev) => [...prev, newLike]);
        if (onDataChange) onDataChange();

        return newLike.id;
      } else {
        // Delete like
        await deleteLike(likeId);
        setLocalLikes((prev) => prev.filter((like) => like.id !== likeId));
        if (onDataChange) onDataChange();
      }
    } catch (error) {
      console.error("Error handling like:", error);
      throw error;
    }
  };

  const handleAddComment = async (content) => {
    try {
      const payload = {
        messageId: Number(message.id),
        content: content,
        authorId: Number(user.id),
        authorName: user.email || "Anoniem",
        createdAt: new Date().toISOString(),
      };

      const response = await createComment(payload);
      const newComment = response.data;

      setLocalComments((prev) => [...prev, newComment]);
      setShowCommentInput(false);
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  return (
    <article className="post-card">
      <div className="post-card__clickable-area" onClick={handleCardClick}>
        <header className="post-card__header">
          <h2 className="post-card__title">{title}</h2>
          <div className="post-card__meta">
            <span className="post-card__author">{author}</span>
            {createdAt && (
              <span className="post-card__date">· {formatDate(createdAt)}</span>
            )}
            {hasBeenUpdated && (
              <span className="post-card__badge">Bewerkt</span>
            )}
          </div>
        </header>

        <div className="post-card__body">
          <p>{content}</p>
        </div>
      </div>

      {/* Social actions - NOT clickable for navigation */}
      <div className="post-card__social">
        <LikeButton
          messageId={message.id}
          initialLikes={localLikes}
          onLikeChange={handleLikeChange}
        />
      </div>

      {/* Inline comments */}
      <InlineComments
        comments={localComments}
        onAddComment={handleAddComment}
        showInput={showCommentInput}
        onToggleInput={() => setShowCommentInput(!showCommentInput)}
      />

      {/* Edit/Delete actions */}
      {(canEdit || canDelete) && (
        <footer className="post-card__footer">
          <div className="post-card__actions">
            {canEdit && (
              <IconButton
                icon={Pencil}
                label="Bericht bewerken"
                variant="default"
                onClick={onEdit}
              />
            )}
            {canDelete && (
              <IconButton
                icon={Trash2}
                label="Bericht verwijderen"
                variant="danger"
                onClick={onDelete}
              />
            )}
          </div>
        </footer>
      )}
    </article>
  );
}

export default PostCard;
