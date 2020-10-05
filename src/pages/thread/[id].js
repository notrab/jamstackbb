import { useRouter } from "next/router";
import useSWR from "swr";

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
      posts(order_by: { created_at: asc }) {
        id
        message
        created_at
        author {
          name
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
      author {
        name
      }
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
    fallback: false,
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
  const hasura = hasuraUserClient();
  const router = useRouter();
  const { id } = router.query;

  const { data, mutate } = useSWR(
    [GetThreadById, id],
    (query, id) => hasura.request(query, { id }),
    {
      initialData,
      revalidateOnMount: true,
    }
  );

  const handlePost = async ({ message }) => {
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
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl md:text-3xl font-semibold">
        {data.threads_by_pk.title}
      </h1>

      <PostList posts={data.threads_by_pk.posts} />
      <PostForm onSubmit={handlePost} />
    </Layout>
  );
}
