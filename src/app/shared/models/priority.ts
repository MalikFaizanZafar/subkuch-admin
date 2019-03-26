export interface Priority {
  id?: number;
  title?: string;
  locked?: boolean;
  data?: PriorityData;
  created?: Date;
  updated?: Date;
}

export interface PriorityData {
  first: PriorityConfiguration;
  second: PriorityConfiguration;
  third: PriorityConfiguration;
}

export interface PriorityConfiguration {
  type?: string;
  item?: any;
}
