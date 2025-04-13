export interface Company {
  title: string;
  description?: string | null;
  photo?: string | null;
  id: string;
  number_of_reviews: number;
  sum_of_reviews: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface CompanyCreate {
  title: string;
  description?: string | null;
  photo?: string | null;
}

export interface CompanyUpdate {
  title?: string | null;
  description?: string | null;
  photo?: string | null;
}

// ------------------------
// Review Interfaces
// ------------------------
export interface Review {
  rating: number; // Rating from 0 to 5
  review_text?: string | null;
  id: string;
  author_id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewCreate {
  rating: number;
  review_text?: string | null;
}

export interface ReviewWithAuthor extends Review {
  author_name?: string | null;
}

// ------------------------
// Vacancy Interfaces
// ------------------------
export type VacancyStatus = "open" | "closed";

export interface Vacancy {
  status: VacancyStatus;
  level: string;
  technology: string;
  salary?: number | null;
  location: string;
  description: string;
  id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface VacancyCreate {
  status?: VacancyStatus; // defaults to "open" if not provided
  level: string;
  technology: string;
  salary?: number | null;
  location: string;
  description: string;
}

export interface VacancyUpdate {
  status?: VacancyStatus | null;
  level?: string | null;
  technology?: string | null;
  salary?: number | null;
  location?: string | null;
  description?: string | null;
}

export interface VacancyWithCompany extends Vacancy {
  company: Company;
}

// ------------------------
// Vacancy Submission Interfaces
// ------------------------
export interface VacancySubmission {
  vacancy_id: string;
  id: string;
  user_id: string;
  submitted_at: string;
}

export interface VacancySubmissionWithDetails extends VacancySubmission {
  // Import your User type from your user types file if needed.
  user: any;
  vacancy: Vacancy;
}

// ------------------------
// Validation Error Types
// ------------------------
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

// ------------------------
// Query Parameter Types
// ------------------------
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface GetCompaniesParams extends PaginationParams {
  search?: string | null;
}

export interface GetVacanciesParams extends PaginationParams {
  status?: VacancyStatus | null;
  technology?: string | null;
  location?: string | null;
}

export interface GetCompanyVacanciesParams extends PaginationParams {
  status?: VacancyStatus | null;
}
