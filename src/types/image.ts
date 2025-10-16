export interface Image {
  id: number;
  url: string;
  caption?: string;
  alt_text?: string;
  copyright_holder_name?: string;
  copyright_holder_link?: string;
  created_at: string;
  updated_at: string;
  width?: number;
  height?: number;
}

export interface ImageCamperImage {
  id: number;
  url: string;
  caption?: string;
  alt_text?: string;
  copyright_holder_name?: string;
  copyright_holder_link?: string;
  created_at: string;
  updated_at: string;
  category?: string;
  width?: number;
  height?: number;
}

export interface CamperImage {
  image_id: number;
  camper_id: number;
  category?: string;
}

export interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}
