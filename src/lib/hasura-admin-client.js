import { GraphQLClient } from "graphql-request";
export { gql } from "graphql-request";

export const hasuraAdminClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_HASURA_API_ENDPOINT,
  {
    headers: {
      "X-Hasura-Admin-Secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET,
    },
  }
);
