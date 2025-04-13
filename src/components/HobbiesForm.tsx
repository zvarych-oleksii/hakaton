import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  HobbiesFormInputs,
  hobbiesFormSchema,
} from "../common/schemas/schemas";

interface HobbiesFormProps {
  onSubmit: (data: HobbiesFormInputs) => void;
  onCancel: () => void;
}

const HobbiesForm: React.FC<HobbiesFormProps> = ({ onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HobbiesFormInputs>({
    resolver: zodResolver(hobbiesFormSchema),
    defaultValues: {
      hobbies: "",
    },
  });

  const submitHandler = (data: HobbiesFormInputs) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <label className="block font-medium">Hobbies (comma separated)</label>
        <input {...register("hobbies")} className="w-full border p-2" />
        {errors.hobbies && (
          <p className="text-red-500">{errors.hobbies.message}</p>
        )}
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default HobbiesForm;
