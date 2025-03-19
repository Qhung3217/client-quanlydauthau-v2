import type { Project } from './project';

export type EstimateStatus = 'PENDING' | 'EDIT_REQUESTED' | 'APPROVED' | 'CANCELED';

export type Estimate = {
  id: string;
  name: string;
  status: EstimateStatus;
  project: Project;
  _count: {
    productEstimates: number;
  };
};

export type EstimateDetails = {
  id: string;
  name: string;
  status: EstimateStatus;
  project: Project;
  productEstimates: {
    id: string;
    name: string;
    desc: string;
  }[];
};
