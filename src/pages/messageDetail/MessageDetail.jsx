
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../../components/ui/loader/Loader";
import ErrorNotice from "../../components/ui/error/ErrorNotice";
import Button from "../../components/ui/button/Button";
import Modal from "../../components/ui/modal/Modal";
import LikeButton from "../../components/social/LikeButton";
import ReplyForm from "../../components/board/replyForm/ReplyForm";
import { getMessageById } from "../../services/messageService";
import { getLikes, createLike, deleteLike } from "../../services/likeService";
import { getComments, createComment } from "../../services/commentService";
import { formatDate } from "../../helpers/formatDate";
import { MessageCircle } from "lucide-react";
import "./MessageDetail.css";

export default function MessageDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [message, setMessage] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [err, setErr] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  // Modal state for errors
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await getMessageById(id);
        setMessage(res?.data ?? null);
      } catch (e) {
        if (e.code === "ECONNABORTED") {
          setErr("De server reageert traag. Probeer het zo nog eens.");
        } else {
          setErr("Kon bericht niet laden.");
        }
        console.error("MessageDetail error:", e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Fetch likes and comments
  useEffect(() => {
    if (!message?.id) return;

    (async () => {
      setLoadingComments(true);
      try {
        const [likesResponse, commentsResponse] = await Promise.all([
          getLikes({ messageId: message.id }),
          getComments({ messageId: message.id }),
        ]);

        const allLikes = likesResponse?.data || [];
        const allComments = commentsResponse?.data || [];

        // Filter for this specific message
        const messageLikes = allLikes.filter(
          (like) => Number(like.messageId) === Number(message.id)
        );
        const messageComments = allComments.filter(
          (comment) => Number(comment.messageId) === Number(message.id)
        );

        setLikes(messageLikes);
        setComments(messageComments);
      } catch (e) {
        console.error("Error fetching social data:", e);
      } finally {
        setLoadingComments(false);
      }
    })();
  }, [message?.id]);

  const handleLikeChange = async (action, likeId) => {
    try {
      if (action === "like") {
        const payload = {
          messageId: Number(message.id),
          userId: Number(user.id),
          createdAt: new Date().toISOString(),
        };
        const response = await createLike(payload);
        const newLike = response.data;

        setLikes((prev) => [...prev, newLike]);
        return newLike.id;
      } else {
        await deleteLike(likeId);
        setLikes((prev) => prev.filter((like) => like.id !== likeId));
      }
    } catch (error) {
      console.error("Error handling like:", error);
      setErrorModal({
        isOpen: true,
        message: "Kon like niet verwerken. Probeer het opnieuw.",
      });
      throw error;
    }
  };

  const handleSubmitComment = async (payload) => {
    try {
      const response = await createComment(payload);
      const newComment = response.data;

      setComments((prev) => [...prev, newComment]);
      setShowReplyForm(false);
    } catch (e) {
      console.error("Error creating comment:", e);
      setErrorModal({
        isOpen: true,
        message:
          e.response?.data?.message ||
          "Kon reactie niet plaatsen. Probeer het opnieuw.",
      });
    }
  };

  if (loading) return <Loader label="Bericht laden…" />;
  if (err) return <ErrorNotice message={err} />;
  if (!message) return <ErrorNotice message="Bericht niet gevonden." />;

  return (
    <div className="message-detail">
      <div className="message-detail__container">
        <Link to="/board" className="message-detail__back">
          ← Terug naar board
        </Link>

        <article className="message-detail__card">
          <header className="message-detail__header">
            <h1 className="message-detail__title">
              {message.title ?? message.subject ?? "Bericht"}
            </h1>
            <div className="message-detail__meta">
              <span className="message-detail__author">
                {message.author || message.username || "Onbekende schrijver"}
              </span>
              {message.createdAt && (
                <span className="message-detail__date">
                  · {formatDate(message.createdAt, true)}
                </span>
              )}
            </div>
          </header>

          <section className="message-detail__content">
            <p>{message.body ?? message.content ?? message.text ?? "—"}</p>
          </section>

          {/* Social actions */}
          <div className="message-detail__social">
            <LikeButton
              messageId={message.id}
              initialLikes={likes}
              onLikeChange={handleLikeChange}
            />
          </div>
        </article>

        {/* Comments Section */}
        <section className="message-detail__comments">
          <div className="comments-header">
            <h2 className="comments-title">
              <MessageCircle size={20} />
              <span>Reacties ({comments.length})</span>
            </h2>

            {!showReplyForm && (
              <Button onClick={() => setShowReplyForm(true)}>Reageren</Button>
            )}
          </div>

          {showReplyForm && (
            <ReplyForm
              messageId={message.id}
              onSubmit={handleSubmitComment}
              onCancel={() => setShowReplyForm(false)}
            />
          )}

          {loadingComments && (
            <p className="comments-loading">Reacties laden...</p>
          )}

          {!loadingComments && comments.length === 0 && !showReplyForm && (
            <div className="comments-empty">
              <p>Nog geen reacties. Wees de eerste!</p>
            </div>
          )}

          {!loadingComments && comments.length > 0 && (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">
                      {comment.authorName || comment.author || "Anoniem"}
                    </span>
                    {comment.createdAt && (
                      <span className="comment-date">
                        {formatDate(comment.createdAt, true)}
                      </span>
                    )}
                  </div>
                  <p className="comment-content">
                    {comment.content || comment.text || comment.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Error Modal */}
      <Modal
        isOpen={errorModal.isOpen}
        title="Fout"
        message={errorModal.message}
        confirmLabel="OK"
        onConfirm={() => setErrorModal({ isOpen: false, message: "" })}
        onCancel={() => setErrorModal({ isOpen: false, message: "" })}
      />
    </div>
  );
}
