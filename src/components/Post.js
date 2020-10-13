import { useState, useCallback, useMemo } from "react";
import formatRelative from "date-fns/formatRelative";
import Markdown from "react-markdown";

import { useAuthState } from "../context/auth";

import PostForm from "./PostForm";
import Reactions from "./Reactions";

import PencilSVG from "../svg/pencil.svg";
import TrashSVG from "../svg/trash.svg";

const today = new Date();

export default function Post({
  id,
  message,
  created_at,
  updated_at,
  author,
  likes,
  likes_aggregate,
  actions,
}) {
  const { isAuthenticated, user } = useAuthState();
  const { handleLike, handleUnlike, handleUpdate, handleDelete } = actions;
  const formattedCreatedAt = useMemo(
    () =>
      formatRelative(Date.parse(created_at), today, {
        weekStartsOn: 1,
      }),
    [created_at]
  );
  const formattedUpdatedAt = useMemo(
    () =>
      formatRelative(Date.parse(updated_at), today, {
        weekStartsOn: 1,
      }),
    [updated_at]
  );
  const isAuthor = isAuthenticated && author.id === user.id;
  const deletePost = () => handleDelete({ id });
  const updated = created_at !== updated_at;
  const [editing, setEditing] = useState(false);

  const toggleEditing = useCallback(() => {
    setEditing((v) => !v);
  }, []);

  const saveAndUpdate = async ({ message }, ...args) => {
    await handleUpdate({ id, message }, ...args);
    setEditing(false);
  };

  return (
    <div id={`post-${id}`} className="py-4 md:py-5 flex items-start space-x-5">
      <div className="flex-1">
        <div className="flex items-center justify-between pb-3 md:pb-6">
          <div className="flex items-center">
            <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-2 md:mr-4">
              <svg
                className="h-full w-full text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
            <div>
              <h3 className="md:text-lg font-semibold text-gray-800">
                {author.name}
              </h3>
              <div className="text-xs text-gray-600">
                {updated
                  ? `Edited ${formattedUpdatedAt}`
                  : `Posted ${formattedCreatedAt}`}
              </div>
            </div>
          </div>

          <div>
            {isAuthor && (
              <>
                <button className="appearance-none p-1" onClick={toggleEditing}>
                  <PencilSVG className="w-4 h-4" />
                </button>

                {handleDelete && (
                  <button className="appearance-none p-1" onClick={deletePost}>
                    <TrashSVG className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <div>
          <div>
            {editing ? (
              <PostForm defaultValues={{ message }} onSubmit={saveAndUpdate} />
            ) : (
              <Markdown source={message} className="prose" />
            )}
          </div>
          <div className="pt-3 md:pt-6">
            <div className="inline-block bg-gray-200 rounded-full px-3 py-1">
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
      </div>
    </div>
  );
}
