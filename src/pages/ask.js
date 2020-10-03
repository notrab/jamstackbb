import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { gql, hasuraAdminClient } from "../lib/hasura-admin-client";
import { hasuraUserClient } from "../lib/hasura-user-client";

import Layout from "../components/Layout";

const GetCategories = gql`
  {
    categories {
      id
      name
    }
  }
`;

const InsertThread = gql`
  mutation InsertThread(
    $categoryId: uuid!
    $title: String!
    $message: String!
  ) {
    insert_threads_one(
      object: {
        category_id: $categoryId
        title: $title
        posts: { data: { message: $message } }
      }
    ) {
      id
      title
      author {
        name
      }
      category {
        name
      }
      posts {
        message
      }
      created_at
    }
  }
`;

export const getStaticProps = async () => {
  const { categories } = await hasuraAdminClient.request(GetCategories);

  return {
    props: {
      categories,
    },
  };
};

export default function AskPage({ categories }) {
  const router = useRouter();
  const hasura = hasuraUserClient();
  const {
    handleSubmit,
    register,
    errors,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async ({ categoryId, title, message }) => {
    try {
      const { insert_threads_one } = await hasura.request(InsertThread, {
        categoryId,
        title,
        message,
      });

      router.push(`/threads/${insert_threads_one.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl">Ask A Question</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <select
            name="categoryId"
            id="categoryId"
            ref={register({
              required: "You must select a category for your thread",
            })}
          >
            {categories.map(({ id, name }) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span>{errors.categoryId.message}</span>}
        </div>
        <div>
          <input
            name="title"
            id="title"
            ref={register({
              required: "You must provide a title.",
            })}
            placeholder="Title"
          />
          {errors.title && <span>{errors.title.message}</span>}
        </div>
        <div>
          <textarea
            name="message"
            id="message"
            ref={register({
              required: "You must provide a message for your thread.",
            })}
            placeholder="Write a message"
          />
          {errors.message && <span>{errors.message.message}</span>}
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            Post
          </button>
        </div>
      </form>
    </Layout>
  );
}
