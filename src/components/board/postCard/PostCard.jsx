import { formatDate } from "../../../helpers/formatDate";
import { useNavigate } from "react-router-dom";
import IconButton from "../../ui/icons/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import "./PostCard.css";

function PostCard({ message, onEdit, onDelete, canEdit, canDelete }) {
  const navigate = useNavigate();
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
    // Don't navigate if clicking on action buttons
    if (e.target.closest(".post-card__actions")) {
      return;
    }
    navigate(`/board/${message.id}`);
  };

  return (
    <article
      className="post-card post-card--clickable"
      onClick={handleCardClick}
    >
      <header className="post-card__header">
        <h2 className="post-card__title">{title}</h2>
        <div className="post-card__meta">
          <span className="post-card__author">{author}</span>
          {createdAt && (
            <span className="post-card__date">· {formatDate(createdAt)}</span>
          )}
          {hasBeenUpdated && <span className="post-card__badge">Bewerkt</span>}
        </div>
      </header>

      <div className="post-card__body">
        <p>{content}</p>
      </div>

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
