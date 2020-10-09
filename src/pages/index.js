import useSWR from "swr";

import Layout from "../components/Layout";
import ThreadList from "../components/ThreadList";

import { gql, hasuraUserClient } from "../lib/hasura-user-client";

const GetThreads = gql`
  {
    threads(order_by: { posts_aggregate: { max: { created_at: desc } } }) {
      id
      title
      answered
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

  const initialData = await hasura.request(GetThreads);

  return {
    props: {
      initialData,
    },
    revalidate: 1,
  };
};

export default function IndexPage({ initialData }) {
  const hasura = hasuraUserClient();

  const { data } = useSWR(GetThreads, (query) => hasura.request(query), {
    initialData,
    revalidateOnMount: true,
  });

  return (
    <Layout>
      <div className="py-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Recent activity
        </h1>
      </div>
      <ThreadList threads={data.threads} />
    </Layout>
  );
}
