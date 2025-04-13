import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WorkExperienceFormInputs,
  workExperienceSchema,
} from "../common/schemas/schemas";

interface WorkExperienceFormProps {
  onSubmit: (data: WorkExperienceFormInputs) => void;
  onCancel: () => void;
}

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkExperienceFormInputs>({
    resolver: zodResolver(workExperienceSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 text-white mb-2">
        <h3 className="text-2xl font-bold">Add Work Experience</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm text-gray-300">Company</label>
          <input
            {...register("company")}
            type="text"
            placeholder="e.g. Google"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
          />
          {errors.company && (
            <p className="text-red-400 text-sm mt-1">
              {errors.company.message}
            </p>
          )}
        </div>

        {/* Position */}
        <div className="col-span-1">
          <label className="block mb-1 text-sm text-gray-300">Position</label>
          <input
            {...register("position")}
            type="text"
            placeholder="e.g. Frontend Developer"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
          />
          {errors.position && (
            <p className="text-red-400 text-sm mt-1">
              {errors.position.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div className="col-span-2">
          <label className="block mb-1 text-sm text-gray-300">Location</label>
          <input
            {...register("location")}
            type="text"
            placeholder="e.g. Berlin"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
          />
          {errors.location && (
            <p className="text-red-400 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Start & End Date in one row */}
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

        {/* Achievements */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm text-gray-300">
            Achievements{" "}
            <span className="text-gray-500">(comma separated)</span>
          </label>
          <input
            {...register("achievements")}
            type="text"
            placeholder="e.g. Increased performance by 30%, Mentored juniors"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
          />
          {errors.achievements && (
            <p className="text-red-400 text-sm mt-1">
              {errors.achievements.message}
            </p>
          )}
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

export default WorkExperienceForm;
