// src/components/ui/modal/Modal.jsx
import "./Modal.css";

export default function Modal({
  isOpen,
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Annuleren",
  onConfirm,
  onCancel,
  children,
}) {
  if (!isOpen) return null;

  const isConfirmMode = Boolean(message && onConfirm);

  return (
    <div className="tp-modal-backdrop" role="dialog" aria-modal="true">
      <div className="tp-modal">
        {/* Header */}
        <header className="tp-modal__header">
          {title && <h2 className="tp-modal__title">{title}</h2>}
          {!isConfirmMode && (
            <button
              type="button"
              className="tp-modal__close"
              onClick={onCancel}
              aria-label="Sluiten"
            >
              ×
            </button>
          )}
        </header>

        {/* Body */}
        <div className="tp-modal__body">
          {isConfirmMode ? <p>{message}</p> : children}
        </div>

        {/* Footer only in confirm mode */}
        {isConfirmMode && (
          <footer className="tp-modal__footer">
            <button
              type="button"
              className="tp-modal__btn tp-modal__btn--secondary"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className="tp-modal__btn tp-modal__btn--primary"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
