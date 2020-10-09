import Link from "next/link";
import formatRelative from "date-fns/formatRelative";

const today = new Date();

export default function Thread({
  id,
  title,
  posts,
  posts_aggregate,
  category,
  pinned,
  locked,
}) {
  const { count } = posts_aggregate.aggregate;
  const hasReplies = count > 1;
  const [lastPost] = posts;
  const timeago = formatRelative(Date.parse(lastPost.created_at), today, {
    weekStartsOn: 1,
  });

  return (
    <div key={id} className="py-4 md:p-5 flex space-x-5 md:hover:bg-gray-100">
      <div>
        <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
          <svg
            className="h-full w-full text-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      </div>
      <div className="flex-1">
        <h3 className="flex items-center justify-between">
          <div className="flex items-center">
            {pinned && (
              <span className="mr-1 text-orange-500">
                <svg
                  className="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M22.314 10.172l-1.415 1.414-.707-.707-4.242 4.242-.707 3.536-1.415 1.414-4.242-4.243-4.95 4.95-1.414-1.414 4.95-4.95-4.243-4.242 1.414-1.415L8.88 8.05l4.242-4.242-.707-.707 1.414-1.415z" />
                </svg>
              </span>
            )}
            {locked && (
              <span className="mr-1 text-red-700">
                <svg
                  className="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1zm-2 0V9A5 5 0 0 0 7 9v1h10zm-6 4v4h2v-4h-2z" />
                </svg>
              </span>
            )}
            <Link href={`/thread/${id}`}>
              <a className="md:text-lg font-semibold text-gray-900 hover:text-green-500">
                {title}
              </a>
            </Link>
          </div>
          {hasReplies && (
            <span className="hidden md:inline-flex items-center ml-3 text-gray-500">
              <svg
                className="fill-current w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M7.291 20.824L2 22l1.176-5.291A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.956 9.956 0 0 1-4.709-1.176zm.29-2.113l.653.35A7.955 7.955 0 0 0 12 20a8 8 0 1 0-8-8c0 1.334.325 2.618.94 3.766l.349.653-.655 2.947 2.947-.655z" />
              </svg>
              <span className="ml-1 text-gray-500 text-xs">{count}</span>
            </span>
          )}
        </h3>
        <div className="inline-flex items-center md:space-x-3 py-1">
          <span className="hidden md:inline-block h-5 w-5 rounded-full overflow-hidden bg-gray-100">
            <svg
              className="h-full w-full text-gray-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
          <span className="text-sm text-gray-600">
            {lastPost.author.name} {hasReplies ? "replied" : "posted"}
            {category && (
              <>
                <span className="mx-1">in</span>
                <Link href={`/category/${category.id}`}>
                  <a className="text-gray-900 hover:text-green-500">
                    {category.name}
                  </a>
                </Link>
              </>
            )}
            <span className="ml-1">{timeago}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
