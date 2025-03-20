import type { Creator } from './user';
import type { Project, ProjectEstimate } from './project';

export type EstimateStatus = 'PENDING' | 'EDIT_REQUESTED' | 'APPROVED' | 'CANCELED';

export type Estimate = {
  id: string;
  name: string;
  status: EstimateStatus;
  project: Project;
  _count: {
    productEstimates: number;
  };
  creator: Creator;
};

export type EstimateDetails = {
  id: string;
  name: string;
  status: EstimateStatus;
  project: ProjectEstimate;
  creator: Creator;
  productEstimates: {
    id: string;
    name: string;
    desc: string;
  }[];
};
