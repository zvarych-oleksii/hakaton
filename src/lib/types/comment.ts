export interface CommentCreate {
  content: string;
  title: string;
  parent_id?: string;
  startup_id: string;
}

export interface Comment extends CommentCreate {
  id: string;
  author_id: string;
  likes: number;
  dislikes: number;
  created_at: string;
  replies: Comment[];
  updated_at: string;
  author_name: string;
  author_avatar: string;
  karma: number;
  replies_count: number;
}
