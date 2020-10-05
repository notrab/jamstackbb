import { useForm } from "react-hook-form";

export default function PostForm({ onSubmit }) {
  const {
    handleSubmit,
    register,
    errors,
    formState: { isSubmitting },
  } = useForm();

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
            <textarea
              name="message"
              id="message"
              ref={register({
                required: "You must provide a message to reply.",
              })}
              placeholder="Reply to thread"
              className="w-full bg-gray-100 rounded p-3"
              rows={5}
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
