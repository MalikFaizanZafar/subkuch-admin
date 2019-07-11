export interface itemModel {
  id?: number,
  name?: string,
  description?: string,
  price?: number,
  discount?: number,
  discount_end_date?: Date,
  image_url?: string,
  available?: boolean,
  isProduct?: boolean,
  quanity?: number,
  category?: ItemCategory,
  franchise_id?: number
}

export interface ItemCategory {
  name?: string;
  type?: string;
}