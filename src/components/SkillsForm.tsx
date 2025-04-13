import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SkillsFormInputs, skillsFormSchema } from "../common/schemas/schemas";
import { FiPlusCircle, FiTrash2, FiSliders } from "react-icons/fi";

interface SkillsFormProps {
  onSubmit: (data: SkillsFormInputs) => void;
  onCancel: () => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ onSubmit, onCancel }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillsFormInputs>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      groupName: "",
      skills: [{ title: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 text-purple-400 mb-2">
        <FiSliders size={22} />
        <h3 className="text-2xl font-bold">Add Skills Group</h3>
      </div>

      {/* Skill Group Name */}
      <div>
        <label className="block mb-1 text-sm text-gray-300">Group Name</label>
        <input
          {...register("groupName")}
          placeholder="e.g. Frontend"
          className="w-full bg-gray-900/50 border border-gray-700 rounded-md px-4 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.groupName && (
          <p className="text-red-400 text-sm mt-1">
            {errors.groupName.message}
          </p>
        )}
      </div>

      {/* Skills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-300 font-semibold">Skills</label>
          <button
            type="button"
            onClick={() => append({ title: "", description: "" })}
            className="flex items-center gap-2 text-purple-500 hover:text-purple-400 text-sm"
          >
            <FiPlusCircle />
            Add Skill
          </button>
        </div>

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="bg-gray-800/60 border border-gray-700 rounded-md p-4 mb-4 relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm text-gray-300">
                  Title
                </label>
                <input
                  {...register(`skills.${index}.title` as const)}
                  placeholder="e.g. React"
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.skills?.[index]?.title && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.skills[index]?.title?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm text-gray-300">
                  Description
                </label>
                <input
                  {...register(`skills.${index}.description` as const)}
                  placeholder="Optional (e.g. Hooks, Context)"
                  className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.skills?.[index]?.description && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.skills[index]?.description?.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-400 transition"
              title="Remove skill"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-2">
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

export default SkillsForm;
