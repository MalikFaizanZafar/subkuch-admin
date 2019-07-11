export interface dealModel {
  name?: string;
  price?: number;
  end_date?: Date;
  deal_image?: string;
  franchise_id?: number;
  items: DealDetail[];
  subtitle?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
}

export interface DealDetail {
  id?: number;
  quantity?: number;
}