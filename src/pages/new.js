import { useState } from "react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import ReactMde from "react-mde";
import Markdown from "react-markdown";

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

export default function NewThreadPage({ categories }) {
  const router = useRouter();
  const hasura = hasuraUserClient();
  const {
    handleSubmit,
    register,
    control,
    errors,
    formState: { isSubmitting },
  } = useForm();
  const [selectedTab, setSelectedTab] = useState("write");

  const onSubmit = async ({ categoryId, title, message }) => {
    try {
      const { insert_threads_one } = await hasura.request(InsertThread, {
        categoryId,
        title,
        message,
      });

      router.push(`/thread/${insert_threads_one.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="py-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary-500">
          Post new thread
        </h1>
      </div>

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
          <Controller
            control={control}
            name="message"
            defaultValue=""
            rules={{
              required: "You must provide a message for your thread.",
            }}
            as={
              <ReactMde
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(<Markdown source={markdown} />)
                }
              />
            }
          />
          {errors.message && <span>{errors.message.message}</span>}
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-500 text-white p-3 rounded"
          >
            Post
          </button>
        </div>
      </form>
    </Layout>
  );
}
