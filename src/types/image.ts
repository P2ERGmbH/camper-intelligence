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

export interface CategorizedImage extends Image{
  category?: string;
}

export interface CamperImage extends CategorizedImage{
    camper_id: number;
}

export interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}
