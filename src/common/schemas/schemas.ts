import { z } from "zod";

export const educationSchema = z.object({
  level: z.string().min(1, "Level is required"),
  institution: z.string().min(1, "Institution is required"),
  major: z.string().min(1, "Major is required"),
  start: z.string().min(1, "Start date is required"),
  end: z.string().optional(),
  gpa: z.string().optional().nullable(),
});

export const workExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().min(1, "Location is required"),
  start: z.string().min(1, "Start date is required"),
  end: z.string().optional(),
  achievements: z.string().min(1, "At least one achievement is required"),
});

export const skillSchema = z.object({
  title: z.string().min(1, "Skill title is required"),
  description: z.string().optional(),
});

export const skillsFormSchema = z.object({
  groupName: z.string().min(1, "Skill group name is required"),
  skills: z.array(skillSchema).min(1, "At least one skill is required"),
});

export const hobbiesFormSchema = z.object({
  hobbies: z.string().min(1, "At least one hobby is required"),
});

export const userUpdateSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  location: z.string().optional(),
  avatar: z
    .instanceof(FileList, { message: "Please upload a profile image" })
    .refine((files) => files.length > 0, { message: "Please select an image" })
    .transform((files) => files[0]),
});

export type UserUpdateFormInputs = z.infer<typeof userUpdateSchema>;

export type HobbiesFormInputs = z.infer<typeof hobbiesFormSchema>;

export type SkillsFormInputs = z.infer<typeof skillsFormSchema>;

export type EducationFormInputs = z.infer<typeof educationSchema>;
export type WorkExperienceFormInputs = z.infer<typeof workExperienceSchema>;
