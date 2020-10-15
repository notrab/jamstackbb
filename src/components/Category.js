import Link from "next/link";
import formatRelative from "date-fns/formatRelative";

import ChatBubbleSVG from "../svg/chat-bubble.svg";
import ArrowRightSVG from "../svg/arrow-right.svg";

const today = new Date();

const LastActivity = ({ hasThreads, threads }) => {
  if (!hasThreads) return null;

  const [lastThread] = threads;

  if (!lastThread) return null;

  const hasReplies = lastThread?.posts_aggregate?.aggregate?.count > 1;
  const [lastPost] = lastThread.posts;

  return (
    <div className="inline-flex items-center md:space-x-3 py-1 md:py-3">
      <span className="hidden md:inline-block h-5 w-5 rounded-full overflow-hidden bg-gray-200">
        <svg
          className="h-full w-full text-gray-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </span>
      <span className="text-sm text-gray-600">
        <span>{lastPost.author.name}</span>
        <span className="ml-1">{hasReplies ? "replied to" : "posted"}</span>
        <span className="ml-1">{lastThread.title}</span>
        {lastPost && (
          <span className="ml-1">
            {formatRelative(Date.parse(lastPost.created_at), today, {
              weekStartsOn: 1,
            })}
          </span>
        )}
      </span>
    </div>
  );
};

export default function Category({ id, name, threads, threads_aggregate }) {
  const { count } = threads_aggregate.aggregate;
  const hasThreads = count >= 1;

  return (
    <div key={id} className="flex items-center space-x-5">
      <Link href={`/category/${id}`}>
        <a className="group w-full flex-1 flex items-center justify-between py-2 md:py-4">
          <div>
            <div className="flex items-center">
              <h3 className="md:text-lg font-semibold text-gray-800 group-hover:text-primary-500 transition-colors duration-75 ease-in-out">
                {name}
              </h3>
            </div>

            <LastActivity hasThreads={hasThreads} threads={threads} />
          </div>

          <div className="hidden md:flex md:items-center md:space-x-3">
            {hasThreads && (
              <span className="hidden md:inline-flex items-center text-gray-500 group-hover:text-white text-xs bg-gray-200 group-hover:bg-primary-500 rounded-full py-1 px-2 transition-colors duration-100 ease-in-out">
                <ChatBubbleSVG className="w-4 h-4" />
                <span className="ml-1">{count}</span>
              </span>
            )}

            <ArrowRightSVG className="text-gray-300 group-hover:text-primary-500 w-8 h-8 transition-colors duration-100 ease-in-out" />
          </div>
        </a>
      </Link>
    </div>
  );
}
