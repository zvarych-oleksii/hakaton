export interface Education {
  level: string;
  institution: string;
  major: string;
  gpa?: string | null;
  start: string;
  end?: string | null;
}

export interface Skill {
  title: string;
  description?: string | null;
}

export interface SkillGroup {
  name: string;
  skills: Skill[];
}

export interface WorkExperience {
  company: string;
  position: string;
  location: string;
  start: string;
  end?: string | null;
  achievements?: string[] | null;
}

export interface User {
  email: string;
  full_name?: string;
  location?: string;
  education?: Education[] | null;
  work_experience?: WorkExperience[] | null;
  skills?: SkillGroup[] | null;
  latex_resume_url?: string;
  pdf_resume_url?: string;
  hobbies?: string[] | null;
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
}

export interface UserUpdate {
  full_name?: string | null;
  location?: string | null;
  education?: Education[] | null;
  work_experience?: WorkExperience[] | null;
  skills?: SkillGroup[] | null;
  hobbies?: string[] | null;
}
