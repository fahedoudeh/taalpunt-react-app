import Button from "../../ui/button/Button";
import { formatDate } from "../../../helpers/formatDate";
import "./PostCard.css";

function PostCard({ message, onEdit, onDelete, canEdit, canDelete }) {
  if (!message) return null;

  // Try to be flexible with possible field names
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

  return (
    <article className="post-card">
      <header className="post-card__header">
        <div>
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
        </div>
      </header>

      <div className="post-card__body">
        <p>{content}</p>
      </div>

      {(canEdit || canDelete) && (
        <footer className="post-card__footer">
          {canEdit && (
            <Button variant="secondary" size="sm" onClick={onEdit}>
              Bewerken
            </Button>
          )}

          {canDelete && (
            <Button variant="danger" size="sm" onClick={onDelete}>
              Verwijderen
            </Button>
          )}
        </footer>
      )}
    </article>
  );
}

export default PostCard;
