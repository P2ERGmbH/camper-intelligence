export interface ImageUpload {
  id: number;
  camper_id: number;
  url: string;
  alt_text?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CamperImageUpload {
  image_id: number;
  camper_id: number;
  category?: string;
}
