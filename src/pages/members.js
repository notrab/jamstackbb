import { useMemo } from "react";
import useSWR from "swr";
import formatRelative from "date-fns/formatRelative";
import differenceInMinutes from "date-fns/differenceInMinutes";

import Layout from "../components/Layout";

import { gql, hasuraUserClient } from "../lib/hasura-user-client";

const today = new Date();

const GetUsers = gql`
  {
    users(order_by: { created_at: asc }) {
      id
      name
      created_at
      last_seen
    }
  }
`;

export const getStaticProps = async () => {
  const hasura = hasuraUserClient();

  const initialData = await hasura.request(GetUsers);

  return {
    props: {
      initialData,
    },
    revalidate: 1,
  };
};

export default function MembersPage({ initialData }) {
  const hasura = hasuraUserClient();

  const { data } = useSWR(GetUsers, (query) => hasura.request(query), {
    initialData,
    revalidateOnMount: true,
  });

  return (
    <Layout>
      <div className="py-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary-500">
          Members
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
        {data.users.map(({ created_at, id, last_seen, name }) => {
          const formattedJoinedAt = useMemo(
            () =>
              formatRelative(Date.parse(created_at), today, {
                weekStartsOn: 1,
              }),
            [created_at]
          );

          const formattedLastSeen = useMemo(
            () => differenceInMinutes(today, Date.parse(last_seen)),
            [last_seen]
          );

          const isUserOnline = 20 >= formattedLastSeen;

          return (
            <div key={id}>
              <div className="flex items-center">
                <span className="relative mr-2 md:mr-4 flex items-center">
                  <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                    <svg
                      className="h-full w-full text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  {isUserOnline ? (
                    <span className="bg-green-500 w-2 h-2 absolute top-0 right-0 rounded-full" />
                  ) : null}
                </span>
                <div>
                  <h3 className="md:text-lg font-semibold text-gray-800">
                    {name}
                  </h3>
                  <div className="text-xs text-gray-600">
                    Joined {formattedJoinedAt}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
