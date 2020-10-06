import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ReactMde from "react-mde";
import Markdown from "react-markdown";

export default function PostForm({ onSubmit }) {
  const {
    handleSubmit,
    control,
    errors,
    formState: { isSubmitting },
  } = useForm();
  const [selectedTab, setSelectedTab] = useState("write");

  return (
    <div className="p-6 flex space-x-3">
      <div>
        <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
          <svg
            className="h-full w-full text-gray-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      </div>
      <div className="flex-1">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Controller
              control={control}
              name="message"
              defaultValue=""
              rules={{
                required: "You must provide a message to reply.",
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
              className="bg-purple-500 text-white p-3 rounded"
            >
              Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
