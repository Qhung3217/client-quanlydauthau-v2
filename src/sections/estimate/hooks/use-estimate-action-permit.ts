'use client';

import type { ProjectStatus } from 'src/types/project';
import type { EstimateStatus } from 'src/types/estimate';

import { PERMISSION_ENUM } from 'src/constants/permission';

import { useCheckPermission } from 'src/auth/hooks';

export default function useEstimateActionPermit(status: EstimateStatus, projectStatus: ProjectStatus) {
  const {
    UPDATE_ESTIMATE_PERMIT,
    APPROVE_ESTIMATE_PERMIT,
    CREATE_ESTIMATE_PERMIT,
    REJECT_ESTIMATE_PERMIT,
    REQUEST_EDIT_ESTIMATE_PERMIT,
  } = useCheckPermission({
    CREATE_ESTIMATE_PERMIT: PERMISSION_ENUM.CREATE_ESTIMATE,
    APPROVE_ESTIMATE_PERMIT: PERMISSION_ENUM.APPROVE_ESTIMATE,
    UPDATE_ESTIMATE_PERMIT: PERMISSION_ENUM.UPDATE_ESTIMATE,
    REJECT_ESTIMATE_PERMIT: PERMISSION_ENUM.CANCEL_ESTIMATE,
    REQUEST_EDIT_ESTIMATE_PERMIT: PERMISSION_ENUM.REQUEST_EDIT_ESTIMATE,
  });

  const createEstimatePermit = CREATE_ESTIMATE_PERMIT;

  const updateEstimatePermit = UPDATE_ESTIMATE_PERMIT
    && status === 'EDIT_REQUESTED'
    && projectStatus !== 'CANCELED'
    && projectStatus !== 'COMPLETED'
    && projectStatus !== 'BUDGET_APPROVED';

  const approveEstimatePermit = APPROVE_ESTIMATE_PERMIT
    && status === 'PENDING'
    && projectStatus === 'APPROVED';

  const rejectEstimatePermit =
    REJECT_ESTIMATE_PERMIT
    && status !== 'APPROVED'
    && status !== 'CANCELED'
    && projectStatus !== 'CANCELED'
    && projectStatus !== 'COMPLETED';

  const requestEditEstimatePermit = REQUEST_EDIT_ESTIMATE_PERMIT
    && status === 'PENDING'
    && projectStatus === 'APPROVED';

  return {
    updateEstimatePermit,
    approveEstimatePermit,
    requestEditEstimatePermit,
    createEstimatePermit,
    rejectEstimatePermit,
  };
}
