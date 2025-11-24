
import "./ErrorNotice.css";

export default function ErrorNotice({ message = "Er ging iets mis." }) {
  return (
    <div role="alert" className="error">
      {message}
    </div>
  );
}
