import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { User } from "./types/user";
import {
  Company,
  CompanyCreate,
  CompanyUpdate,
  GetCompaniesParams,
  GetCompanyVacanciesParams,
  GetVacanciesParams,
  PaginationParams,
  Review,
  ReviewCreate,
  ReviewWithAuthor,
  Vacancy,
  VacancyCreate,
  VacancySubmission,
  VacancySubmissionWithDetails,
  VacancyUpdate,
  VacancyWithCompany,
} from "./types/company";
import { CreateStartup, Startup, StartupAnalysis } from "./types/startups";
import { CommentCreate, Comment } from "./types/comment";

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

const useApi = () => {
  const { getIdTokenClaims } = useAuth0();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const tokenClaims = await getIdTokenClaims();
      const token = tokenClaims?.__raw;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  const analyzeStartup = async (
    startupId: string,
  ): Promise<StartupAnalysis> => {
    const response = await axiosInstance.post(`analyze_startup/${startupId}`);
    return response.data;
  };

  const likeComment = async (commentId: string): Promise<Comment> => {
    const response = await axiosInstance.post(
      `startup-comments/${commentId}/like`,
    );
    return response.data;
  };

  const dislikeComment = async (commentId: string): Promise<Comment> => {
    const response = await axiosInstance.post(
      `startup-comments/${commentId}/dislike`,
    );
    return response.data;
  };

  const createComment = async (data: CommentCreate): Promise<Comment> => {
    try {
      const response = await axiosInstance.post(`startup-comments`, data);
      return response.data;
      // @ts-ignore
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        "Something went wrong. Please try again.";
      alert(message);
      throw err; // якщо хочеш пробросити далі
    }
  };

  const updateComment = async (
    commentId: string,
    data: Partial<Comment>,
  ): Promise<Comment> => {
    const response = await axiosInstance.patch(
      `startup-comments/${commentId}`,
      data,
    );
    return response.data;
  };

  const deleteComment = async (commentId: string): Promise<void> => {
    await axiosInstance.delete(`startup-comments/${commentId}`);
  };

  const getCommentById = async (commentId: string): Promise<Comment> => {
    const response = await axiosInstance.get(`startup-comments/${commentId}`);
    return response.data;
  };

  const listComments = async (params?: {
    startup_id?: string;
    parent_id?: string;
    limit?: number;
    skip?: number;
  }): Promise<Comment[]> => {
    const query = new URLSearchParams();
    if (params?.startup_id) query.append("startup_id", params.startup_id);
    if (params?.parent_id) query.append("parent_id", params.parent_id);
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.skip) query.append("skip", params.skip.toString());

    const response = await axiosInstance.get(
      `/startup-comments?${query.toString()}`,
    );
    return response.data;
  };

  const getCommentsByStartupId = async (
    startupId: string,
  ): Promise<Comment[]> => {
    const response = await axiosInstance.get(
      `startup-comments/startup/${startupId}`,
    );
    return response.data;
  };

  const createStartup = async (data: CreateStartup): Promise<Startup> => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "logo" && value instanceof File) {
          formData.append("logo", value);
        } else {
          formData.append(key, value);
        }
      }
    });

    const response = await axiosInstance.post(`startups`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  // Get list of startups
  const getStartups = async (filters?: {
    skip?: number;
    limit?: number;
    field?: string;
    phase?: "crowdfunding" | "ecosystem";
    search?: string;
  }): Promise<Startup[]> => {
    const query = new URLSearchParams();
    if (filters?.skip !== undefined)
      query.append("skip", filters.skip.toString());
    if (filters?.limit !== undefined)
      query.append("limit", filters.limit.toString());
    if (filters?.field) query.append("field", filters.field);
    if (filters?.phase) query.append("phase", filters.phase);
    if (filters?.search) query.append("search", filters.search);
    const response = await axiosInstance.get(`startups?${query.toString()}`);
    return response.data;
  };

  // Get one startup by ID
  const getStartupById = async (startupId: string): Promise<Startup> => {
    const response = await axiosInstance.get(`startups/${startupId}`);
    return response.data;
  };

  // Update startup info via JSON (excluding logo)
  const updateStartup = async (
    startupId: string,
    data: Partial<Startup>,
  ): Promise<Startup> => {
    const response = await axiosInstance.patch(`startups/${startupId}`, data);
    return response.data;
  };

  const updateStartupLogo = async (
    startupId: string,
    logo: File,
  ): Promise<Startup> => {
    const formData = new FormData();
    formData.append("logo", logo);
    const response = await axiosInstance.patch(
      `startups/${startupId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  };

  // Delete startup
  const deleteStartup = async (startupId: string): Promise<void> => {
    await axiosInstance.delete(`startups/${startupId}`);
  };

  const generateUserResume = async (): Promise<{
    pdf_url: string;
    latex_url: string;
  }> => {
    const response = await axiosInstance.get("users/me/resume");
    return response.data;
  };

  const uploadUserResume = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await axiosInstance.post("users/me/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  // ------------- User Methods -------------
  const getCurrentUser = async (): Promise<User> => {
    try {
      const response = await axiosInstance.get<User>("users/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  };

  const updateCurrentUser = async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await axiosInstance.patch<User>("users/me", userData);
      return response.data;
    } catch (error) {
      console.error("Error updating current user:", error);
      throw error;
    }
  };

  const updateUserAvatar = async (formData: FormData): Promise<User> => {
    try {
      const response = await axiosInstance.post<User>(
        "/users/me/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user avatar:", error);
      throw error;
    }
  };

  // ------------- Company Methods -------------
  const getCompanies = async (
    params?: GetCompaniesParams,
  ): Promise<Company[]> => {
    try {
      const response = await axiosInstance.get<Company[]>("companies", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  };

  const createCompany = async (data: CompanyCreate): Promise<Company> => {
    try {
      const response = await axiosInstance.post<Company>("companies", data);
      return response.data;
    } catch (error) {
      console.error("Error creating company:", error);
      throw error;
    }
  };

  const getCompany = async (companyId: string): Promise<Company> => {
    try {
      const response = await axiosInstance.get<Company>(
        `companies/${companyId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching company:", error);
      throw error;
    }
  };

  const updateCompany = async (
    companyId: string,
    data: CompanyUpdate,
  ): Promise<Company> => {
    try {
      const response = await axiosInstance.patch<Company>(
        `companies/${companyId}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating company:", error);
      throw error;
    }
  };

  const deleteCompany = async (companyId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`companies/${companyId}`);
    } catch (error) {
      console.error("Error deleting company:", error);
      throw error;
    }
  };

  // ------------- Company Reviews Methods -------------
  const getCompanyReviews = async (
    companyId: string,
    params?: PaginationParams,
  ): Promise<ReviewWithAuthor[]> => {
    try {
      const response = await axiosInstance.get<ReviewWithAuthor[]>(
        `companies/${companyId}/reviews`,
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching company reviews:", error);
      throw error;
    }
  };

  const createCompanyReview = async (
    companyId: string,
    data: ReviewCreate,
  ): Promise<Review> => {
    try {
      const response = await axiosInstance.post<Review>(
        `companies/${companyId}/reviews`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating company review:", error);
      throw error;
    }
  };

  // ------------- Vacancy Methods -------------
  const createVacancy = async (
    companyId: string,
    data: VacancyCreate,
  ): Promise<Vacancy> => {
    try {
      const response = await axiosInstance.post<Vacancy>(
        `companies/${companyId}/vacancies`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating vacancy:", error);
      throw error;
    }
  };

  const getCompanyVacancies = async (
    companyId: string,
    params?: GetCompanyVacanciesParams,
  ): Promise<Vacancy[]> => {
    try {
      const response = await axiosInstance.get<Vacancy[]>(
        `companies/${companyId}/vacancies`,
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching company vacancies:", error);
      throw error;
    }
  };

  const getAllVacancies = async (
    params?: GetVacanciesParams,
  ): Promise<VacancyWithCompany[]> => {
    try {
      const response = await axiosInstance.get<VacancyWithCompany[]>(
        "vacancies",
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all vacancies:", error);
      throw error;
    }
  };

  const getVacancy = async (vacancyId: string): Promise<VacancyWithCompany> => {
    try {
      const response = await axiosInstance.get<VacancyWithCompany>(
        `vacancies/${vacancyId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching vacancy:", error);
      throw error;
    }
  };

  const updateVacancy = async (
    vacancyId: string,
    data: VacancyUpdate,
  ): Promise<Vacancy> => {
    try {
      const response = await axiosInstance.patch<Vacancy>(
        `vacancies/${vacancyId}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating vacancy:", error);
      throw error;
    }
  };

  const deleteVacancy = async (vacancyId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`vacancies/${vacancyId}`);
    } catch (error) {
      console.error("Error deleting vacancy:", error);
      throw error;
    }
  };

  // ------------- Vacancy Application Methods -------------
  const applyForVacancy = async (
    vacancyId: string,
  ): Promise<VacancySubmission> => {
    try {
      const response = await axiosInstance.post<VacancySubmission>(
        `vacancies/${vacancyId}/apply`,
      );
      return response.data;
    } catch (error) {
      console.error("Error applying for vacancy:", error);
      throw error;
    }
  };

  const getVacancySubmissions = async (
    vacancyId: string,
    params?: PaginationParams,
  ): Promise<VacancySubmissionWithDetails[]> => {
    try {
      const response = await axiosInstance.get<VacancySubmissionWithDetails[]>(
        `vacancies/${vacancyId}/submissions`,
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching vacancy submissions:", error);
      throw error;
    }
  };

  const getMySubmissions = async (
    params?: PaginationParams,
  ): Promise<VacancySubmissionWithDetails[]> => {
    try {
      const response = await axiosInstance.get<VacancySubmissionWithDetails[]>(
        "users/me/submissions",
        {
          params,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching my submissions:", error);
      throw error;
    }
  };

  const withdrawApplication = async (submissionId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`vacancy-submissions/${submissionId}`);
    } catch (error) {
      console.error("Error withdrawing application:", error);
      throw error;
    }
  };

  return {
    // User
    getCurrentUser,
    updateCurrentUser,
    updateUserAvatar,
    generateUserResume,
    uploadUserResume,
    // Companies
    getCompanies,
    createCompany,
    getCompany,
    updateCompany,
    deleteCompany,
    // Reviews
    getCompanyReviews,
    createCompanyReview,
    // Vacancies
    createVacancy,
    getCompanyVacancies,
    getAllVacancies,
    getVacancy,
    updateVacancy,
    deleteVacancy,
    // Vacancy Applications
    applyForVacancy,
    getVacancySubmissions,
    getMySubmissions,
    withdrawApplication,
    createStartup,
    getStartups,
    getStartupById,
    updateStartup,
    updateStartupLogo,
    deleteStartup,
    getCommentById,
    getCommentsByStartupId,
    createComment,
    updateComment,
    deleteComment,
    listComments,
    likeComment,
    dislikeComment,
    analyzeStartup,
  };
};

export default useApi;
