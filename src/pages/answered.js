import useSWR from "swr";

import Layout from "../components/Layout";
import ThreadList from "../components/ThreadList";

import { gql, hasuraUserClient } from "../lib/hasura-user-client";

const GetAnsweredPosts = gql`
  query GetAnsweredPosts {
    threads(
      where: { answered: { _eq: true } }
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

  const initialData = await hasura.request(GetAnsweredPosts);

  return {
    props: {
      initialData,
    },
    revalidate: 1,
  };
};

export default function AnsweredPostsPage({ initialData }) {
  const hasura = hasuraUserClient();

  const { data } = useSWR(GetAnsweredPosts, (query) => hasura.request(query), {
    initialData,
    revalidateOnMount: true,
  });

  return (
    <Layout>
      <h1 className="text-3xl">Answered posts</h1>
      <ThreadList threads={data.threads} />
    </Layout>
  );
}
