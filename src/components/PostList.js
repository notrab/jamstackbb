import Post from "./Post";

export default function PostList({
  posts: postsProps,
  actions: actionProps,
  ...props
}) {
  if (!postsProps) return null;

  const [firstPost, ...posts] = postsProps;
  const { handleDelete, ...actions } = actionProps;

  return (
    <div className="pt-3 md:pt-6">
      <Post {...firstPost} {...props} actions={actions} />
      {posts.map((p) => (
        <Post
          key={p.id}
          {...p}
          {...props}
          actions={{ ...actions, handleDelete }}
        />
      ))}
    </div>
  );
}
