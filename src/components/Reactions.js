import { useAuthState } from "../context/auth";

import ThumbsUpSolid from "../svg/thumbs-up-solid.svg";
import ThumbsUp from "../svg/thumbs-up.svg";

export default function Reactions({
  postId,
  likes,
  likes_aggregate,
  handleLike,
  handleUnlike,
}) {
  const { isAuthenticated, user } = useAuthState();
  const {
    aggregate: { count },
  } = likes_aggregate;
  const like = () => handleLike({ postId });
  const unlike = (id) => handleUnlike({ id });
  const liked = isAuthenticated
    ? likes.find((l) => l.user_id === user.id)
    : false;

  return (
    <div className="flex items-center">
      <div className="text-primary-500 mr-2">
        {isAuthenticated ? (
          <button
            className="appearance-none p-1 flex items-center"
            onClick={liked ? () => unlike(liked.id) : like}
          >
            {liked ? (
              <ThumbsUpSolid className="w-4 h-4" />
            ) : (
              <ThumbsUp className="w-4 h-4" />
            )}
          </button>
        ) : (
          <ThumbsUp className="w-4 h-4" />
        )}
      </div>
      <span className="text-sm text-primary-500 py-1">{count}</span>
      {liked && (
        <span className="ml-2 text-sm text-gray-600 py-1">You like this</span>
      )}
    </div>
  );
}
