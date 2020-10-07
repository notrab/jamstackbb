import useSWR from "swr";

import Layout from "../components/Layout";
import ThreadList from "../components/ThreadList";

import { gql, hasuraUserClient } from "../lib/hasura-user-client";

const GetUnansweredPosts = gql`
  query GetUnansweredPosts {
    threads(
      where: { answered: { _neq: true } }
      order_by: { posts_aggregate: { max: { created_at: desc } } }
    ) {
      id
      title
      locked
      author {
        name
      }
      category {
        id
        name
      }
      posts(limit: 1, order_by: { created_at: desc }) {
        id
        message
        created_at
        author {
          name
        }
      }
      posts_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const getStaticProps = async () => {
  const hasura = hasuraUserClient();

  const initialData = await hasura.request(GetUnansweredPosts);

  return {
    props: {
      initialData,
    },
    revalidate: 1,
  };
};

export default function AnsweredPostsPage({ initialData }) {
  const hasura = hasuraUserClient();

  const { data } = useSWR(
    GetUnansweredPosts,
    (query) => hasura.request(query),
    {
      initialData,
      revalidateOnMount: true,
    }
  );

  return (
    <Layout>
      <h1 className="text-3xl">Unanswered posts</h1>
      <ThreadList threads={data.threads} />
    </Layout>
  );
}
