'use client';

import type { EstimateStatus } from 'src/types/estimate';

import { PERMISSION_ENUM } from 'src/constants/permission';

import { useCheckPermission } from 'src/auth/hooks';

export default function useEstimateActionPermit(status: EstimateStatus) {
  const { UPDATE_ESTIMATE_PERMIT, VIEW_ESTIMATE_PERMIT, CREATE_ESTIMATE_PERMIT } =
    useCheckPermission({
      CREATE_ESTIMATE_PERMIT: PERMISSION_ENUM.CREATE_ESTIMATE,
      VIEW_ESTIMATE_PERMIT: PERMISSION_ENUM.VIEW_ESTIMATE,
      UPDATE_ESTIMATE_PERMIT: PERMISSION_ENUM.UPDATE_ESTIMATE,
    });

  const createEstimatePermit = CREATE_ESTIMATE_PERMIT;

  const updateEstimatePermit = UPDATE_ESTIMATE_PERMIT && status === 'EDIT_REQUESTED';

  const viewEstimatePermit = VIEW_ESTIMATE_PERMIT;

  return {
    updateEstimatePermit,
    viewEstimatePermit,

    createEstimatePermit,
  };
}
