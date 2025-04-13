import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserUpdateFormInputs,
  userUpdateSchema,
} from "../common/schemas/schemas";

interface UserUpdateFormProps {
  onSubmit: (data: UserUpdateFormInputs) => void;
  onCancel: () => void;
  initialValues?: Partial<Omit<UserUpdateFormInputs, "avatar">>;
}

const UserUpdateForm: React.FC<UserUpdateFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdateFormInputs>({
    // @ts-ignore
    resolver: zodResolver(userUpdateSchema),
    defaultValues: initialValues,
  });

  return (
    // @ts-ignore
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-white">
      <h3 className="text-2xl font-bold text-center mb-4">Update Profile</h3>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Full Name
        </label>
        <input
          {...register("full_name")}
          placeholder="John Doe"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.full_name && (
          <p className="text-red-400 text-sm mt-1">
            {errors.full_name.message}
          </p>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Location
        </label>
        <input
          {...register("location")}
          placeholder="Kyiv, Ukraine"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.location && (
          <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>
        )}
      </div>

      {/* Avatar Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Profile Image
        </label>
        <input
          type="file"
          accept="image/*"
          {...register("avatar")}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.avatar && (
          <p className="text-red-400 text-sm mt-1">
            {errors.avatar.message as string}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-semibold transition"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default UserUpdateForm;
