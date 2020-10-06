import { useRouter } from "next/router";
import useSWR from "swr";

import Layout from "../../components/Layout";
import ThreadList from "../../components/ThreadList";

import { gql, hasuraUserClient } from "../../lib/hasura-user-client";

const GetCategoryIds = gql`
  {
    categories {
      id
    }
  }
`;

const GetCategoryById = gql`
  query GetCategoryById($id: uuid!) {
    categories_by_pk(id: $id) {
      id
      name
      threads(
        order_by: {
          pinned: desc
          posts_aggregate: { max: { created_at: desc } }
        }
      ) {
        id
        title
        answered
        locked
        pinned
        author {
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
  }
`;

export const getStaticPaths = async () => {
  const hasura = hasuraUserClient();

  const { categories } = await hasura.request(GetCategoryIds);

  return {
    paths: categories.map(({ id }) => ({
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

  const initialData = await hasura.request(GetCategoryById, { id });

  return {
    props: {
      initialData,
    },
  };
};

export default function CategoryPage({ initialData }) {
  const hasura = hasuraUserClient();
  const { query } = useRouter();
  const { id } = query;

  const { data } = useSWR(
    [GetCategoryById, id],
    (query, id) => hasura.request(query, { id }),
    {
      initialData,
      revalidateOnMount: true,
    }
  );

  return (
    <Layout>
      <h1 className="text-2xl md:text-3xl font-semibold">
        {data.categories_by_pk.name}
      </h1>

      <ThreadList threads={data.categories_by_pk.threads} />
    </Layout>
  );
}
