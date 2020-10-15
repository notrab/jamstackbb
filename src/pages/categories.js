import useSWR from "swr";

import Layout from "../components/Layout";
import CategoryList from "../components/CategoryList";

import { gql, hasuraUserClient } from "../lib/hasura-user-client";

const GetCategories = gql`
  query GetCategories {
    categories(where: { parent_id: { _is_null: true } }) {
      id
      name
      threads(
        limit: 1
        order_by: { posts_aggregate: { max: { created_at: desc } } }
      ) {
        title
        posts(limit: 1, order_by: { created_at: desc }) {
          author {
            name
          }
          created_at
        }
        posts_aggregate {
          aggregate {
            count
          }
        }
      }
      threads_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const getStaticProps = async () => {
  const hasura = hasuraUserClient();

  const initialData = await hasura.request(GetCategories);

  return {
    props: {
      initialData,
    },
    revalidate: 1,
  };
};

export default function CategoriesPage({ initialData }) {
  const hasura = hasuraUserClient();

  const { data } = useSWR(GetCategories, (query) => hasura.request(query), {
    initialData,
    revalidateOnMount: true,
  });

  return (
    <Layout>
      <div className="py-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary-500">
          Categories
        </h1>
      </div>
      <CategoryList categories={data.categories} />
    </Layout>
  );
}
