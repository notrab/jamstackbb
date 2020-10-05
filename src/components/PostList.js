import Post from "./Post";

export default function PostList({ posts }) {
  if (!posts) return null;

  return <div className="py-6 md:py-12 divide-y">{posts.map(Post)}</div>;
}
