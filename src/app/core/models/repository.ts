import { Branch } from './branch';

export interface Repository {
  id?: number;
  idSelectedBranch?: number;
  idSelectedBranchOld?: number;
  name?: string;
  link?: string;
  active?: boolean;
  branches?: Branch[];
  isProcessing?: boolean;
  processedValue?: number;
  selected?: boolean;
  commitDate?: Date;
}
