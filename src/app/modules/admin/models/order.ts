import { itemModel } from './itemModel';
import { dealModel } from './dealModel';

export interface Order {
  acknowledged?: boolean;
  delivery?: boolean;
  detail?: OrderDetail[];
  discount?: number;
  endtime?: Date;
  franchiseId?: number;
  id?: number;
  starttime?: Date;
  status?: string;
  thresholdLimit?: string;
  total?: number;
  location?: string;
  orderNumber?: string;
  userId?: any;
}

export interface OrderDetail {
  quantity?: number;
  item: itemModel;
  deal: dealModel;
}

export interface OrderRequest {
    acknowledged?: boolean;
    deals?: OrderItems[];
    delivery?: boolean;
    franchiseId?: number;
    items?: OrderItems[];
    userId?: number;
    location?: string;
    orderTotal?: number;
    orderNumber?: string;
}

export interface OrderItems {
  id?: number;
  quantity?: number;
}
