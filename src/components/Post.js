import formatRelative from "date-fns/formatRelative";
import Markdown from "react-markdown";

import { useAuthState } from "../context/auth";

import Reactions from "./Reactions";

const today = new Date();

export default function Post({
  id,
  message,
  created_at,
  author,
  likes,
  likes_aggregate,
  actions,
}) {
  const { isAuthenticated, user } = useAuthState();
  const { handleLike, handleUnlike, handleDelete } = actions;
  const timeago = formatRelative(Date.parse(created_at), today, {
    weekStartsOn: 1,
  });
  const isAuthor = isAuthenticated && author.id === user.id;
  const deletePost = () => handleDelete({ id });

  return (
    <div className="p-6 flex space-x-3">
      <div>
        <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
          <svg
            className="h-full w-full text-gray-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <div className="pb-3">
            <h3 className="text-xl font-semibold">{author.name}</h3>
          </div>
          <div>
            {isAuthor && (
              <button className="appearance-none p-1" onClick={deletePost}>
                <svg
                  className="fill-current w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zM9 4v2h6V4H9z" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div>
          <Markdown source={message} />
        </div>
        <div className="pt-6">
          <span className="text-sm text-gray-600">{timeago}</span>
        </div>
        <div>
          <Reactions
            postId={id}
            likes={likes}
            likes_aggregate={likes_aggregate}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
          />
        </div>
      </div>
    </div>
  );
}
