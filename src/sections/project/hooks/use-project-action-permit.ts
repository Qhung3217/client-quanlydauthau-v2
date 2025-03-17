'use client';

import { PERMISSION_ENUM } from 'src/constants/permission';

import { useCheckPermission } from 'src/auth/hooks';

export default function useProjectActionPermit(status: string) {
  const { DELETE_PERMIT, EDIT_PERMIT, APPROVE_PERMIT, REJECT_PERMIT, REQUEST_EDIT_PERMIT } =
    useCheckPermission({
      EDIT_PERMIT: PERMISSION_ENUM.UPDATE_PROJECT,
      DELETE_PERMIT: PERMISSION_ENUM.DELETE_PROJECT,
      APPROVE_PERMIT: PERMISSION_ENUM.APPROVE_PROJECT,
      REJECT_PERMIT: PERMISSION_ENUM.CANCEL_PROJECT,
      REQUEST_EDIT_PERMIT: PERMISSION_ENUM.REQUEST_EDIT_PROJECT,
    });

  const editPermit = EDIT_PERMIT && status === 'EDIT_REQUESTED';

  const deletePermit = DELETE_PERMIT && status === 'PENDING';

  const approvePermit = APPROVE_PERMIT && status === 'PENDING';

  const rejectPermit = REJECT_PERMIT && status !== 'COMPLETED' && status !== 'CANCELED';

  const requestEditPermit = REQUEST_EDIT_PERMIT && status === 'PENDING';

  return {
    editPermit,
    deletePermit,
    approvePermit,
    rejectPermit,
    requestEditPermit,
  };
}
