import { useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { gql, hasuraUserClient } from "../lib/hasura-user-client";
import { useAuthState, useAuthDispatch } from "../context/auth";

import Layout from "../components/Layout";

const UpdateUser = gql`
  mutation UpdateUser($id: uuid!, $email: String!, $name: String!) {
    update_users_by_pk(
      pk_columns: { id: $id, email: $email }
      _set: { name: $name }
    ) {
      id
      name
    }
  }
`;

export default function EditProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthState();
  const { updateUser } = useAuthDispatch();
  const hasura = hasuraUserClient();
  const {
    handleSubmit,
    register,
    errors,
    formState: { isSubmitting },
  } = useForm({ defaultValues: user });

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const onSubmit = async ({ name }) => {
    try {
      const { update_users_by_pk } = await hasura.request(UpdateUser, {
        id: user.id,
        email: user.email,
        name,
      });

      updateUser(update_users_by_pk);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="py-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary-500">
          Edit profile
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            name="name"
            id="name"
            ref={register({
              required: "You must provide a name.",
            })}
            placeholder="Your name"
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-500 text-white p-3 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </Layout>
  );
}
