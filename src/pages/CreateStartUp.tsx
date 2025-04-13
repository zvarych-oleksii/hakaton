import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaRocket,
  FaFileUpload,
  FaCoins,
  FaFlagCheckered,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RoutesMain } from "../common/enums/routes";
import useApi from "../lib/axiosClient";

// === Constants ===
const ALL_CATEGORIES = ["IT", "Miltech", "Fintech"] as const;

// === Schema ===
const schema = z.object({
  name: z.string().min(1, "Startup name is required"),
  location: z.string().min(1, "Location is required"),
  field: z.enum(ALL_CATEGORIES, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  logo: z.any().optional(),
  description: z.string().min(5, "Description is too short"),
  monetization_model: z.string().min(5, "Please describe monetization model"),
  stage: z.string().min(1, "Stage is required"),
  phase: z.enum(["crowdfunding", "ecosystem"]),
  completed: z.string().optional(),
  interested_in: z.string().optional(),
  goal: z.string().optional(),
  raised_funds: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const CreateStartUp: React.FC = () => {
  const { createStartup } = useApi();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      phase: "crowdfunding",
    },
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const phase = watch("phase");

  const onSubmit = async (data: FormData) => {
    try {
      const created = await createStartup(data);
      navigate(RoutesMain.LocationProfile.replace(":id", created.id));
    } catch (error) {
      console.error("Startup creation failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen text-white px-6 py-10 max-w-2xl mx-auto space-y-12"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🚀 Launch Your Startup</h1>
        <p className="text-gray-400">
          Fill in the form to list your startup on the platform
        </p>
      </div>

      {/* Logo Upload */}
      <div className="text-center">
        <label
          htmlFor="logo-upload"
          className="cursor-pointer inline-flex items-center gap-3 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition"
        >
          <FaFileUpload />
          {logoFile ? logoFile.name : "Upload Logo"}
        </label>
        <input
          type="file"
          accept="image/*"
          id="logo-upload"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setLogoFile(file);
              setValue("logo", file);
            }
          }}
        />
      </div>

      {/* Basic Info */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaRocket /> Basic Info
        </h2>

        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            {...register("name")}
            placeholder="Enter name"
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${errors.name ? "border-red-500" : "border-gray-600"}`}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1">Location</label>
          <input
            {...register("location")}
            placeholder="Enter location"
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${errors.location ? "border-red-500" : "border-gray-600"}`}
          />
          {errors.location && (
            <p className="text-red-400 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Field (Dropdown) */}
        <div>
          <label className="block mb-1">Field</label>
          <select
            {...register("field")}
            className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${errors.field ? "border-red-500" : "border-gray-600"}`}
            defaultValue=""
          >
            <option value="" disabled>
              Select a category
            </option>
            {ALL_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.field && (
            <p className="text-red-400 text-sm mt-1">{errors.field.message}</p>
          )}
        </div>
      </section>

      {/* Description & Monetization */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FaCoins /> Business Model
        </h2>

        <div>
          <label className="block mb-1">Short Description</label>
          <textarea
            {...register("description")}
            placeholder="What's your startup about?"
            className={`w-full px-4 py-2 h-24 rounded bg-gray-800 text-white border ${errors.description ? "border-red-500" : "border-gray-600"} resize-none`}
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1">Monetization Model</label>
          <textarea
            {...register("monetization_model")}
            placeholder="How will your startup generate revenue?"
            className={`w-full px-4 py-2 h-20 rounded bg-gray-800 text-white border ${errors.monetization_model ? "border-red-500" : "border-gray-600"} resize-none`}
          />
          {errors.monetization_model && (
            <p className="text-red-400 text-sm mt-1">
              {errors.monetization_model.message}
            </p>
          )}
        </div>
      </section>

      {/* Stage */}
      <div>
        <label className="block mb-1">Startup Stage</label>
        <input
          {...register("stage")}
          placeholder="e.g. MVP, Pre-seed"
          className={`w-full px-4 py-2 rounded bg-gray-800 text-white border ${errors.stage ? "border-red-500" : "border-gray-600"}`}
        />
        {errors.stage && (
          <p className="text-red-400 text-sm mt-1">{errors.stage.message}</p>
        )}
      </div>

      {/* Phase Toggle */}
      <section>
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <FaFlagCheckered /> Phase
        </h2>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setValue("phase", "crowdfunding")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${phase === "crowdfunding"
                ? "bg-purple-600 border-purple-500 text-white"
                : "border-gray-500 text-gray-300 hover:bg-gray-700"
              }`}
          >
            Crowdfunding
          </button>
          <button
            type="button"
            onClick={() => setValue("phase", "ecosystem")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition border ${phase === "ecosystem"
                ? "bg-purple-600 border-purple-500 text-white"
                : "border-gray-500 text-gray-300 hover:bg-gray-700"
              }`}
          >
            Ecosystem
          </button>
        </div>
      </section>

      {/* Dynamic Fields by Phase */}
      <section className="bg-gray-900/40 border border-gray-700 rounded-xl p-6 space-y-4">
        {phase === "ecosystem" ? (
          <>
            <div>
              <label className="block mb-1">Completed</label>
              <input
                {...register("completed")}
                placeholder="e.g. MVP ready"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1">Raised Funds</label>
              <input
                {...register("raised_funds")}
                placeholder="e.g. $500K"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1">Interested In</label>
              <input
                {...register("interested_in")}
                placeholder="e.g. Mentors, Partners"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block mb-1">Funding Goal</label>
              <input
                {...register("goal")}
                placeholder="e.g. $2,000,000"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
              />
            </div>
            <div>
              <label className="block mb-1">Already Raised</label>
              <input
                {...register("raised_funds")}
                placeholder="e.g. $1,000,000"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600"
              />
            </div>
          </>
        )}
      </section>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          className="px-10 py-3 bg-blue-600 hover:bg-blue-500 rounded-full text-white font-semibold text-lg shadow-md transition"
        >
          🚀 Submit Startup
        </button>
      </div>
    </form>
  );
};

export default CreateStartUp;
