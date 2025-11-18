import { useEffect } from "react";
import "./Toast.css";

export default function Toast({ type = "info", message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose(), 2400); // auto-hide
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast--${type}`}>
      <span className="toast__message">{message}</span>
    </div>
  );
}
