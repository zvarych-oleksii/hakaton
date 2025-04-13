import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const postSchema = z.object({
  content: z.string().min(1, "Content is required"),
  title: z.string().optional(),
});

type PostFormSchema = z.infer<typeof postSchema>;

type Props = {
  onSubmit: (newPost: PostFormSchema & { uniqueness: number }) => void;
  onCancel: () => void;
};

const CreatePostForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormSchema>({
    resolver: zodResolver(postSchema),
  });

  const submitHandler = (data: PostFormSchema) => {
    onSubmit({
      ...data,
      uniqueness: 91,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="bg-black/40 p-6 rounded-lg border border-purple-600 mb-8"
    >
      <h2 className="text-lg font-bold mb-4 text-center">CREATE YOUR POST</h2>

      <textarea
        className="w-full h-32 p-3 rounded bg-card-dark text-white placeholder:text-gray-400 mb-2 resize-none"
        placeholder="Type Your Post Here"
        {...register("content")}
      />
      {errors.content && (
        <p className="text-red-400 text-sm mb-2">{errors.content.message}</p>
      )}

      <input
        type="text"
        placeholder="Optional Title"
        {...register("title")}
        className="w-full p-3 rounded bg-card-dark text-white placeholder:text-gray-400 mb-4"
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 transition"
          >
            POST
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreatePostForm;
