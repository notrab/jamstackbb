import { useRouter } from "next/router";
import useSWR from "swr";

import { useAuthState } from "../../context/auth";

import Layout from "../../components/Layout";
import PostList from "../../components/PostList";
import PostForm from "../../components/PostForm";

import { gql, hasuraUserClient } from "../../lib/hasura-user-client";

const GetThreadIds = gql`
  {
    threads {
      id
    }
  }
`;

const GetThreadById = gql`
  query GetThreadById($id: uuid!) {
    threads_by_pk(id: $id) {
      id
      title
      locked
      answered
      author {
        id
      }
      posts(order_by: { created_at: asc }) {
        id
        message
        created_at
        updated_at
        author {
          id
          name
        }
        likes {
          id
          user_id
        }
        likes_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  }
`;

const InsertPost = gql`
  mutation InsertPost($threadId: uuid!, $message: String!) {
    insert_posts_one(object: { thread_id: $threadId, message: $message }) {
      id
      message
      created_at
      updated_at
      author {
        id
        name
      }
      likes {
        id
        user_id
      }
      likes_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

const UpdatePost = gql`
  mutation UpdatePost($id: uuid!, $message: String!) {
    update_posts_by_pk(pk_columns: { id: $id }, _set: { message: $message }) {
      id
      message
      updated_at
    }
  }
`;

const UpdateLockedStatus = gql`
  mutation UpdateLockedStatus($id: uuid!, $locked: Boolean) {
    update_threads_by_pk(pk_columns: { id: $id }, _set: { locked: $locked }) {
      id
      locked
    }
  }
`;

const UpdateAnsweredStatus = gql`
  mutation UpdateAnsweredStatus($id: uuid!, $answered: Boolean) {
    update_threads_by_pk(
      pk_columns: { id: $id }
      _set: { answered: $answered }
    ) {
      id
      answered
    }
  }
`;

const DeleteThreadById = gql`
  mutation DeleteThreadById($id: uuid!) {
    delete_threads_by_pk(id: $id) {
      id
    }
  }
`;

const InsertLike = gql`
  mutation InsertLike($postId: uuid!) {
    insert_likes_one(object: { post_id: $postId }) {
      id
    }
  }
`;

const DeleteLike = gql`
  mutation DeleteLike($id: uuid!) {
    delete_likes_by_pk(id: $id) {
      id
    }
  }
`;

const DeletePost = gql`
  mutation DeletePost($id: uuid!) {
    delete_posts_by_pk(id: $id) {
      id
    }
  }
`;

export const getStaticPaths = async () => {
  const hasura = hasuraUserClient();

  const { threads } = await hasura.request(GetThreadIds);

  return {
    paths: threads.map(({ id }) => ({
      params: {
        id,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const hasura = hasuraUserClient();
  const { id } = params;

  const initialData = await hasura.request(GetThreadById, { id });

  return {
    props: {
      initialData,
    },
    revalidate: 1,
  };
};

export default function ThreadPage({ initialData }) {
  const { isAuthenticated, user } = useAuthState();
  const hasura = hasuraUserClient();
  const router = useRouter();
  const { id, isFallback } = router.query;

  const { data, mutate } = useSWR(
    [GetThreadById, id],
    (query, id) => hasura.request(query, { id }),
    {
      initialData,
      revalidateOnMount: true,
    }
  );

  if (!isFallback && !data)
    return (
      <Layout>
        <p>No such thread found</p>
      </Layout>
    );

  const isAuthor = isAuthenticated && data.threads_by_pk.author.id === user.id;

  const handlePost = async ({ message }, { target }) => {
    try {
      const { insert_posts_one } = await hasura.request(InsertPost, {
        threadId: id,
        message,
      });

      mutate({
        ...data,
        threads_by_pk: {
          ...data.threads_by_pk,
          posts: [...data.threads_by_pk.posts, insert_posts_one],
        },
      });

      target.reset();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async ({ id, message }, { target }) => {
    try {
      const { update_posts_by_pk } = await hasura.request(UpdatePost, {
        id,
        message,
      });

      mutate({
        ...data,
        threads_by_pk: {
          ...data.threads_by_pk,
          posts: data.threads_by_pk.posts.reduce((posts, post) => {
            if (post.id === id)
              return [
                ...posts,
                {
                  ...post,
                  ...update_posts_by_pk,
                },
              ];

            return [...posts, post];
          }, []),
        },
      });

      target.reset();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLock = async () => {
    try {
      const { update_threads_by_pk } = await hasura.request(
        UpdateLockedStatus,
        {
          id,
          locked: !data.threads_by_pk.locked,
        }
      );

      mutate({
        ...data,
        ...update_threads_by_pk,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleAnswer = async () => {
    try {
      const { update_threads_by_pk } = await hasura.request(
        UpdateAnsweredStatus,
        {
          id,
          answered: !data.threads_by_pk.answered,
        }
      );

      mutate({
        ...data,
        ...update_threads_by_pk,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteThread = async () => {
    try {
      await hasura.request(DeleteThreadById, {
        id,
      });

      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async ({ postId }) => {
    await hasura.request(InsertLike, { postId });

    mutate();
  };

  const handleUnlike = async ({ id }) => {
    await hasura.request(DeleteLike, { id });

    mutate();
  };

  const handleDelete = async ({ id }) => {
    await hasura.request(DeletePost, {
      id,
    });

    mutate({
      ...data,
      threads_by_pk: {
        ...data.threads_by_pk,
        posts: data.threads_by_pk.posts.filter((p) => p.id !== id),
      },
    });
  };

  if (isFallback) return <Layout>Loading thread</Layout>;

  return (
    <Layout>
      <div className="py-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          {data.threads_by_pk.title}
        </h1>
      </div>

      <div className="flex items-center">
        {data.threads_by_pk.locked && (
          <span className="bg-red-300 text-red-800 px-2 py-1 rounded-full uppercase text-xs">
            Locked
          </span>
        )}
        {data.threads_by_pk.answered && (
          <span className="bg-primary-300 text-primary-800 px-2 py-1 rounded-full uppercase text-xs">
            Answered
          </span>
        )}
        {isAuthor && (
          <>
            <button onClick={handleLock} className="appearance-none p-1">
              {data.threads_by_pk.locked ? "Unlock" : "Lock"}
            </button>
            <button onClick={handleAnswer} className="appearance-none p-1">
              {data.threads_by_pk.answered
                ? "Mark as unanswered"
                : "Mark as answered"}
            </button>
            <button
              onClick={handleDeleteThread}
              className="appearance-none p-1"
            >
              Delete thread
            </button>
          </>
        )}
      </div>

      <PostList
        posts={data.threads_by_pk.posts}
        actions={{ handleLike, handleUnlike, handleUpdate, handleDelete }}
      />
      {!data.threads_by_pk.locked && isAuthenticated && (
        <div className="py-4 md:p-5 flex items-start space-x-5 border-t border-primary-100">
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
          <div className="flex-1">
            <PostForm onSubmit={handlePost} />
          </div>
        </div>
      )}
    </Layout>
  );
}
