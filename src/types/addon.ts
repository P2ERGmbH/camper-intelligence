export interface Addon {
  id: number;
  name: string;
  category: string;
  description?: string | null;
  price_per_unit: number;
  max_quantity?: number | null;
  created_at: string;
  updated_at: string;
}
