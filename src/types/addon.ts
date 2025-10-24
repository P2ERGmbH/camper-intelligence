export interface Addon {
  id: number;
  provider_id: number;
  name: string;
  category: string;
  description?: string | null;
  price_per_unit: number;
  max_quantity?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Option {
  optionIndex?: number;
  label?: string;
  mandatory?: boolean;
  price?: string;
  disabled?: boolean;
  selected?: boolean;
  value?: number;
  hint?: string;
  calculated?: number;
}
