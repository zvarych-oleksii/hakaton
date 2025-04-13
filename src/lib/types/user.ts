export interface User {
  email: string;
  full_name?: string;
  latex_resume_url?: string;
  pdf_resume_url?: string;
  hobbies?: string[] | null;
  id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
}
