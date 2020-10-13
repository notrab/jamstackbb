import Link from "next/link";
import formatRelative from "date-fns/formatRelative";

import PinSVG from "../svg/pin.svg";
import DoubleCheckSVG from "../svg/double-check.svg";
import LockSVG from "../svg/lock.svg";
import ChatBubbleSVG from "../svg/chat-bubble.svg";
import ArrowRightSVG from "../svg/arrow-right.svg";

const today = new Date();

export default function Thread({
  id,
  title,
  posts,
  posts_aggregate,
  category,
  answered,
  pinned,
  locked,
}) {
  const { count: rawCount } = posts_aggregate.aggregate;
  const count = rawCount - 1;
  const hasReplies = count >= 1;
  const [lastPost] = posts;
  const timeago = formatRelative(Date.parse(lastPost.created_at), today, {
    weekStartsOn: 1,
  });

  return (
    <div key={id} className="flex items-center space-x-5">
      <div>
        <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-200">
          <svg
            className="h-full w-full text-gray-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      </div>
      <div className="flex items-center w-full">
        <Link href={`/thread/${id}`}>
          <a className="group w-full flex-1 flex items-center justify-between py-2 md:py-4">
            <div>
              <div className="flex items-center">
                <h3 className="md:text-lg font-semibold text-gray-800 group-hover:text-primary-500 transition-colors duration-75 ease-in-out">
                  {title}
                </h3>
                {pinned && (
                  <span className="ml-1 text-orange-500">
                    <PinSVG className="w-4 h-4" />
                  </span>
                )}
              </div>

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
                  <span>
                    {lastPost.author.name} {hasReplies ? "replied" : "posted"}
                  </span>
                  {category && <span className="ml-1">in {category.name}</span>}
                  <span className="ml-1">{timeago}</span>
                </span>
              </div>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-3">
              {answered && (
                <span className="md:inline-flex items-center text-green-600 text-xs rounded-full">
                  <DoubleCheckSVG className="w-3 h-3" />
                  <span className="ml-1">Answered</span>
                </span>
              )}

              {locked && (
                <span className="md:inline-flex items-center text-red-700 text-xs rounded-full">
                  <LockSVG className="w-3 h-3" />
                  <span className="ml-1">Locked</span>
                </span>
              )}

              {hasReplies && (
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
    </div>
  );
}
