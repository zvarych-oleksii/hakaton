import React from "react";
import { useForm, useController, Control } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaStar } from "react-icons/fa";

const reviewSchema = z.object({
  review: z.string().min(1, "Review is required"),
  rating: z.preprocess(
      (val) => Number(val),
      z.number().min(1, "Minimum rating is 1").max(5, "Maximum rating is 5")
  ),
});

type ReviewFormSchema = z.infer<typeof reviewSchema>;

type Props = {
  onSubmit: (newReview: ReviewFormSchema) => void;
  onCancel: () => void;
};

interface StarRatingProps {
  control: Control<ReviewFormSchema>;
  name: "rating";
}

const StarRating: React.FC<StarRatingProps> = ({ control, name }) => {
  // Provide defaultValue explicitly in the controller to ensure a defined number value
  const { field } = useController({
    control,
    name,
    defaultValue: 1,
  });

  // Guarantee that field.value is a number for proper comparison
  const currentRating = Number(field.value) || 0;

  return (
      <div className="flex mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
                key={star}
                onClick={() => field.onChange(star)}
                // Stars up to currentRating become "gold"; the rest "gray"
                color={star <= currentRating ? "gold" : "gray"}
                className="cursor-pointer text-2xl"
            />
        ))}
      </div>
  );
};

const CreateReviewForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormSchema>({
    // @ts-ignore
    resolver: zodResolver(reviewSchema),
    defaultValues: { review: "", rating: 1 },
  });

  const submitHandler = (data: ReviewFormSchema) => {
    onSubmit(data);
  };

  return (
      <form
          // @ts-ignore
          onSubmit={handleSubmit(submitHandler)}
          className="bg-black/40 p-6 rounded-lg border border-purple-600 mb-8"
      >
        <h2 className="text-lg font-bold mb-4 text-center">CREATE YOUR REVIEW</h2>

        <textarea
            className="w-full h-32 p-3 rounded bg-card-dark text-white placeholder:text-gray-400 mb-2 resize-none"
            placeholder="Type your review here"
            {...register("review")}
        />
        {errors.review && (
            <p className="text-red-400 text-sm mb-2">{errors.review.message}</p>
        )}


        <StarRating
            // @ts-ignore
            control={control} name="rating" />
        {errors.rating && (
            <p className="text-red-400 text-sm mb-2">
              {errors.rating.message?.toString()}
            </p>
        )}

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
              Submit
            </button>
          </div>
        </div>
      </form>
  );
};

export default CreateReviewForm;
