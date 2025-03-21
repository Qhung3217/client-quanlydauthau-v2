'use client';

import { PERMISSION_ENUM } from 'src/constants/permission';

import { useCheckPermission } from 'src/auth/hooks';

export default function useProjectActionPermit(status: string) {
  const {
    DELETE_PERMIT,
    EDIT_PERMIT,
    APPROVE_PERMIT,
    REJECT_PERMIT,
    REQUEST_EDIT_PERMIT,
    CREATE_ESTIMATE_PERMIT,
    VIEW_ESTIMATE_PERMIT,
    EXPORT_EXCEL_PROJECT
  } = useCheckPermission({
    EDIT_PERMIT: PERMISSION_ENUM.UPDATE_PROJECT,
    DELETE_PERMIT: PERMISSION_ENUM.DELETE_PROJECT,
    APPROVE_PERMIT: PERMISSION_ENUM.APPROVE_PROJECT,
    REJECT_PERMIT: PERMISSION_ENUM.CANCEL_PROJECT,
    REQUEST_EDIT_PERMIT: PERMISSION_ENUM.REQUEST_EDIT_PROJECT,
    CREATE_ESTIMATE_PERMIT: PERMISSION_ENUM.CREATE_ESTIMATE,
    VIEW_ESTIMATE_PERMIT: PERMISSION_ENUM.VIEW_ESTIMATE,
    EXPORT_EXCEL_PROJECT: PERMISSION_ENUM.EXPORT_EXCEL_PROJECT,
  });

  const editPermit = EDIT_PERMIT && status === 'EDIT_REQUESTED';

  const deletePermit = DELETE_PERMIT && status === 'PENDING';

  const approvePermit = APPROVE_PERMIT && status === 'PENDING';

  const rejectPermit = REJECT_PERMIT && status !== 'COMPLETED' && status !== 'CANCELED';

  const requestEditPermit = REQUEST_EDIT_PERMIT && status === 'PENDING';

  const createEstimatePermit = CREATE_ESTIMATE_PERMIT && status === 'APPROVED';

  const exportExcelProjectPermit = EXPORT_EXCEL_PROJECT &&
    (status !== 'PENDING' && status !== 'EDIT_REQUESTED' && status !== 'CANCELED');

  const viewEstimatePermit = VIEW_ESTIMATE_PERMIT;

  return {
    editPermit,
    deletePermit,
    approvePermit,
    rejectPermit,
    requestEditPermit,
    createEstimatePermit,
    viewEstimatePermit,
    exportExcelProjectPermit
  };
}
