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
    categories(where: { parent_id: { _is_null: true } }) {
      id
      name
      sub_categories {
        id
        name
      }
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
        <div className="py-3 flex space-x-3">
          <div className="md:w-1/5">
            <div className="bg-gray-200 py-2 px-3 rounded-lg w-full">
              <select
                name="categoryId"
                id="categoryId"
                ref={register({
                  required: "You must select a category for your thread",
                })}
                className="appearance-none bg-transparent w-full"
              >
                {categories.map(({ id, name, sub_categories }) => (
                  <React.Fragment key={id}>
                    <option value={id}>{name}</option>
                    {sub_categories.length > 0 && (
                      <optgroup label="Sub categories">
                        {sub_categories.map(({ id, name }) => (
                          <option value={id} key={id}>
                            {name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </React.Fragment>
                ))}
              </select>
            </div>
            {errors.categoryId && <span>{errors.categoryId.message}</span>}
          </div>

          <div className="flex-1">
            <input
              name="title"
              id="title"
              ref={register({
                required: "You must provide a title.",
              })}
              placeholder="Title"
              className="bg-gray-200 py-2 px-3 rounded-lg w-full"
            />
            {errors.title && <span>{errors.title.message}</span>}
          </div>
        </div>
        <div className="py-3">
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
        <div className="py-3">
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
