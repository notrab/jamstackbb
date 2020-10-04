import { GraphQLClient } from "graphql-request";
export { gql } from "graphql-request";

export const hasuraUserClient = () => {
  let token;

  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("jamstackforum-auth"));

    token = user?.token;
  }

  return new GraphQLClient(process.env.NEXT_PUBLIC_HASURA_API_ENDPOINT, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};
