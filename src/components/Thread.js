import Link from "next/link";
import formatRelative from "date-fns/formatRelative";

const today = new Date();

export default function Thread({
  id,
  title,
  posts,
  posts_aggregate,
  category,
}) {
  const { count } = posts_aggregate.aggregate;
  const hasReplies = count > 1;
  const [lastPost] = posts;
  const timeago = formatRelative(Date.parse(lastPost.created_at), today, {
    weekStartsOn: 1,
  });

  return (
    <div key={id} className="p-6 flex space-x-3">
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
        <h3 className="text-xl font-semibold">
          <Link href={`/thread/${id}`}>
            <a>{title}</a>
          </Link>
        </h3>
        <div className="inline-flex items-center space-x-3">
          <span className="inline-block h-5 w-5 rounded-full overflow-hidden bg-gray-100">
            <svg
              className="h-full w-full text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
          <span>
            {lastPost.author.name} {hasReplies ? "replied" : "posted"} in{" "}
            <Link href={`/category/${category.id}`}>
              <a>{category.name}</a>
            </Link>
            <span className="ml-1">{timeago}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
