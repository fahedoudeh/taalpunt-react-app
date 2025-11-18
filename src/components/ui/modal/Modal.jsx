import Button from "../button/Button";
import "./Modal.css";

export default function Modal({
  isOpen,
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Annuleren",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && onCancel) {
      onCancel();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="modal__title">
          {title}
        </h2>
        {message && <p className="modal__message">{message}</p>}
        <div className="modal__actions">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              size="sm"
            >
              {cancelLabel}
            </Button>
          )}
          {onConfirm && (
            <Button
              type="button"
              variant="danger"
              onClick={onConfirm}
              size="sm"
            >
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
