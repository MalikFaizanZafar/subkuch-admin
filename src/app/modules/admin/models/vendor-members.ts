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

export interface MemberDetails {
  userId?: string,
  companyName?: string,
  companyLogo?: string,
  companyRating?: number,
  companyImage?: string,
  overview?: MemberOverview
}

export interface MemberDetailsResponse {
  data?:  any;
  statusCode?: number;
  statusMessage?: string; 
}

export interface MemberOverview {
  welcomeParagraph?: string,
  contact?: MemberContact
  openingStatus?: MemberOpeningStatus
}
export interface MemberOverviewResponse{
  data?:  any;
  statusCode?: number;
  statusMessage?: string;
}

export interface MemberContact {
  phone?: any[],
  email?: any
}

export interface MemberOpeningStatus {
  start?: any,
  end?: any
}

export interface order {
  oNum?: number,
  user?: string,
  dateTime?: dateTime,
  items?: orderItem[],
  status?: string 
}

export interface orderItem {
  name?: string,
  quantity?: number
}

export interface dateTime {
  date?: string,
  time?: string
}