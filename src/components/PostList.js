import Post from "./Post";

export default function PostList({ posts, ...props }) {
  if (!posts) return null;

  return (
    <div className="pt-3 md:pt-6 md:divide-y md:divide-gray-200">
      {posts.map((p) => (
        <Post key={p.id} {...p} {...props} />
      ))}
    </div>
  );
}
