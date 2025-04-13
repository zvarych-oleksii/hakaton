import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { User } from "./types/user";
import {LocationCreate, Location} from "./types/location.ts";

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

  const getCurrentUser = async (): Promise<User> => {
    try {
      const response = await axiosInstance.get<User>("users/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  };

  const createLocation = async (
      data: LocationCreate,
  ): Promise<Location> => {
    const response = await axiosInstance.post("locations/", data);
    return response.data;
  };

  const listLocations = async (params?: {
    skip?: number;
    limit?: number;
    search?: string;
    types?: string[];
  }): Promise<Location[]> => {
    const query = new URLSearchParams();
    if (params?.skip !== undefined) {
      query.append("skip", params.skip.toString());
    }
    if (params?.limit !== undefined) {
      query.append("limit", params.limit.toString());
    }
    if (params?.search !== undefined) {
      query.append("search", params.search);
    }
    if (params?.types && params.types.length > 0) {
      params.types.forEach((type) => query.append("types", type));
    }

    const response = await axiosInstance.get(`locations/?${query.toString()}`);
    return response.data;
  };

  return {
    getCurrentUser,
    listLocations,
    createLocation,
  };
};

export default useApi;
