export interface Memeber {
  username?: string;
  password?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

export interface MemberResponse {
  data?: Memeber;
  statusCode?: number;
  statusMessage?: string;
}

export class VendorUser {
  address?: string = '';
  contact?: string = '';
  email?: string = '';
  latitude?: string = '';
  longitude?: string = '';
  manager_name?: string = '';
  name?: string = '';
  ntn?: string = '';
  password?: string = '';
  service_id?: number;
  username?: string = '';
}
