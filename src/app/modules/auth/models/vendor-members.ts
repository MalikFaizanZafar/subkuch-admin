export interface Memeber {
  username?: string;
  password?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

export interface MemberResponse {
  data?:  Memeber;
  statusCode?: number;
  statusMessage?: string; 
}