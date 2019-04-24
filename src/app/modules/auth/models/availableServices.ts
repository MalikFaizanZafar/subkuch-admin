export interface AvailableServices {
  id?: number;
  name?: string;
  enabled?: boolean;
}


export interface AvailableServicesResponse {
  data?: AvailableServices[];
  message?: string ;
  pageNumber: number;
  pageSize?: number
  statusCode?: number;
  totalElements?: number;
}