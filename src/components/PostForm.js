import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ReactMde from "react-mde";
import Markdown from "react-markdown";

export default function PostForm({ defaultValues, onSubmit }) {
  const {
    handleSubmit,
    control,
    errors,
    formState: { isSubmitting },
    reset,
  } = useForm({ defaultValues: { message: "", ...defaultValues } });
  const [selectedTab, setSelectedTab] = useState("write");

  const handleOnSubmit = async (values) => {
    try {
      await onSubmit(values);
      reset();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div>
        <Controller
          control={control}
          name="message"
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
      <div className="py-3 md:py-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary-500 text-white p-3 rounded"
        >
          {defaultValues?.message ? "Save" : "Reply"}
        </button>
      </div>
    </form>
  );
}
