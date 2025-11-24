
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Heart } from "lucide-react";
import "./LikeButton.css";

export default function LikeButton({
  messageId,
  initialLikes = [],
  onLikeChange,
}) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userLikeId, setUserLikeId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    // Find if current user has liked this message
    const userLike = initialLikes.find(
      (like) => Number(like.userId) === Number(user.id)
    );

    setIsLiked(Boolean(userLike));
    setUserLikeId(userLike?.id || null);
    setLikeCount(initialLikes.length);
  }, [initialLikes, user?.id]);

  const handleClick = async () => {
    if (!user?.id) {
      alert("Je moet ingelogd zijn om berichten te liken");
      return;
    }

    // Optimistic UI update
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (isLiked) {
      // Unlike
      setIsLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));

      if (onLikeChange) {
        await onLikeChange("unlike", userLikeId);
      }
    } else {
      // Like
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);

      if (onLikeChange) {
        const newLikeId = await onLikeChange("like", null);
        setUserLikeId(newLikeId);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`like-button ${isLiked ? "like-button--active" : ""} ${
        isAnimating ? "like-button--animating" : ""
      }`}
      aria-label={isLiked ? "Unlike dit bericht" : "Like dit bericht"}
    >
      <Heart
        size={18}
        className="like-button__icon"
        fill={isLiked ? "currentColor" : "none"}
      />
      {likeCount > 0 && <span className="like-button__count">{likeCount}</span>}
    </button>
  );
}
