import formatRelative from "date-fns/formatRelative";
import Markdown from "react-markdown";

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
  const timeago = formatRelative(Date.parse(created_at), today, {
    weekStartsOn: 1,
  });

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
        <h3 className="text-xl font-semibold">{author.name}</h3>
        <div>
          <Markdown source={message} />
        </div>
        <div className="pt-3">
          <span className="text-sm text-gray-600">{timeago}</span>
        </div>
        <div>
          <Reactions
            postId={id}
            likes={likes}
            likes_aggregate={likes_aggregate}
            {...actions}
          />
        </div>
      </div>
    </div>
  );
}
