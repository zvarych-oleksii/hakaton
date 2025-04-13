import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EducationFormInputs,
  educationSchema,
} from "../common/schemas/schemas";

interface EducationFormProps {
  onSubmit: (data: EducationFormInputs) => void;
  onCancel: () => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EducationFormInputs>({
    resolver: zodResolver(educationSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 text-white mb-2">
        <h3 className="text-2xl font-bold">Add Education</h3>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Level */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm text-gray-300">Level</label>
          <input
            {...register("level")}
            type="text"
            placeholder="e.g. Bachelor's"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.level && (
            <p className="text-red-400 text-sm mt-1">{errors.level.message}</p>
          )}
        </div>

        {/* Institution */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm text-gray-300">
            Institution
          </label>
          <input
            {...register("institution")}
            type="text"
            placeholder="e.g. MIT"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.institution && (
            <p className="text-red-400 text-sm mt-1">
              {errors.institution.message}
            </p>
          )}
        </div>

        {/* Major */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm text-gray-300">Major</label>
          <input
            {...register("major")}
            type="text"
            placeholder="e.g. Computer Science"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.major && (
            <p className="text-red-400 text-sm mt-1">{errors.major.message}</p>
          )}
        </div>

        {/* GPA */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm text-gray-300">GPA</label>
          <input
            {...register("gpa")}
            type="text"
            placeholder="e.g. 3.9"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.gpa && (
            <p className="text-red-400 text-sm mt-1">{errors.gpa.message}</p>
          )}
        </div>

        {/* Dates in a row */}
        <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm text-gray-300">
              Start Date
            </label>
            <input
              {...register("start")}
              type="date"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.start && (
              <p className="text-red-400 text-sm mt-1">
                {errors.start.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="block mb-1 text-sm text-gray-300">End Date</label>
            <input
              {...register("end")}
              type="date"
              className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.end && (
              <p className="text-red-400 text-sm mt-1">{errors.end.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-md bg-green-600 hover:bg-green-500 transition shadow-lg"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EducationForm;
