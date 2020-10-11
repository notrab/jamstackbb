import Link from "next/link";
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
  fragment Thread on threads {
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

  query GetCategoryById($id: uuid!) {
    categories_by_pk(id: $id) {
      id
      name
      subCategories {
        id
        name
      }
      pinned: threads(
        where: { pinned: { _eq: true } }
        order_by: { posts_aggregate: { max: { created_at: desc } } }
      ) {
        ...Thread
      }
      threads(
        where: { pinned: { _neq: true } }
        order_by: { posts_aggregate: { max: { created_at: desc } } }
      ) {
        ...Thread
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
    revalidate: 1,
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
      <div className="py-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary-500">
          {data.categories_by_pk.name}
        </h1>
      </div>

      {data.categories_by_pk.subCategories.map(({ id, name }) => (
        <Link key={id} href={`/category/${id}`}>
          {name}
        </Link>
      ))}

      <ThreadList threads={data.categories_by_pk.pinned} />
      <ThreadList threads={data.categories_by_pk.threads} />
    </Layout>
  );
}
