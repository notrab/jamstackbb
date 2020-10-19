import { useForm } from "react-hook-form";

export default function EditTitleForm({ defaultValues, onSubmit }) {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-3">
      <div className="flex-1">
        <input
          id="title"
          name="title"
          placeholder="Thread title"
          ref={register({
            required: "You must provide a title.",
          })}
          className="bg-gray-200 py-2 px-3 rounded-lg w-full"
        />
      </div>
      <div>
        <button
          type="submit"
          className="bg-primary-500 text-white p-3 rounded"
          disabled={isSubmitting}
        >
          Save
        </button>
      </div>
    </form>
  );
}
