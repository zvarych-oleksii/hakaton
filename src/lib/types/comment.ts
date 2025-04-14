import { User } from "./user";

export interface LocationReview {
  id: string;
  rating: number;
  review: string;
  reply_to_id?: string | null;
  user: User;
  location_id: string;
  created_at: string;
  updated_at: string;
  replies?: LocationReview[];
}

export interface LocationReviewCreate {
  rating: number;
  review: string;
  reply_to_id?: string | null;
  location_id: string;
}

