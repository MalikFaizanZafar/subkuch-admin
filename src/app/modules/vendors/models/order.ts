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
  userId?: number;
}

export interface OrderDetail {
  quantity?: number;
  item: itemModel;
  deal: dealModel;
}
