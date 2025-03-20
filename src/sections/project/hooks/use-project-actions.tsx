'use client';

import type { Project } from 'src/types/project';

import { toast } from 'sonner';
import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import LoadingButton from '@mui/lab/LoadingButton';

import { shortenTextInMiddle } from 'src/utils/format-string';

import { rejectProject, approveProject, requestEditProject } from 'src/actions/project-ssr';

import { ConfirmDialog } from 'src/components/custom-dialog';

const APPROVE_PROJECT = 'APPROVE_PROJECT';
const REJECT_PROJECT = 'REJECT_PROJECT';
const REQUEST_EDIT_PROJECT = 'REQUEST_EDIT_PROJECT';

export default function useProjectActions() {
  const [projectSelected, setProjectSelected] = useState<Project | undefined | null>(null);
  const [action, setAction] = useState('');

  const isProcessing = useBoolean();

  const confirming = useBoolean();

  const onApprove = (project: Project | undefined | null) => {
    confirming.onTrue();
    setAction(APPROVE_PROJECT);
    setProjectSelected(project);
  };

  const onReject = (project: Project | undefined | null) => {
    confirming.onTrue();
    setAction(REJECT_PROJECT);
    setProjectSelected(project);
  };

  const onRequestEdit = (project: Project | undefined | null) => {
    confirming.onTrue();
    setAction(REQUEST_EDIT_PROJECT);
    setProjectSelected(project);
  };

  const onClose = () => {
    confirming.onFalse();
    setTimeout(() => {
      setAction('');
    });
  };
  const handleApprove = async () => {
    if (!projectSelected) return;
    try {
      isProcessing.onTrue();
      await approveProject(projectSelected.id);
      toast.success(`Dự án ${shortenTextInMiddle(projectSelected.name, 30)} duyệt thành công.`);
    } catch {
      toast.error('Đã có lỗi xảy ra.');
    } finally {
      confirming.onFalse();
      isProcessing.onFalse();
    }
  };
  const handleReject = async () => {
    if (!projectSelected) return;
    try {
      isProcessing.onTrue();
      await rejectProject(projectSelected.id);
      toast.success(`Hủy dự án ${shortenTextInMiddle(projectSelected.name, 30)} thành công.`);
    } catch {
      toast.error('Đã có lỗi xảy ra.');
    } finally {
      confirming.onFalse();
      isProcessing.onFalse();
    }
  };

  const handleRequestEdit = async () => {
    if (!projectSelected) return;
    try {
      isProcessing.onTrue();
      await requestEditProject(projectSelected.id);
      toast.success(
        `Đã gửi Yêu cầu điều chỉnh dự án ${shortenTextInMiddle(projectSelected.name, 30)} .`
      );
    } catch {
      toast.error('Đã có lỗi xảy ra.');
    } finally {
      confirming.onFalse();
      isProcessing.onFalse();
    }
  };

  const renderConfirmDialog = () => {
    switch (action) {
      case REJECT_PROJECT:
        return (
          <ConfirmDialog
            open={confirming.value}
            onClose={onClose}
            closeAfterTransition
            title="Hủy dự án này?"
            content={
              <>
                Xác nhận <u>hủy dự án</u> <strong>{projectSelected?.name}</strong>? Lưu ý, thao này
                không thể hoàn tác.
              </>
            }
            action={
              <LoadingButton
                variant="outlined"
                color="warning"
                loading={isProcessing.value}
                onClick={handleReject}
              >
                Hủy dự án
              </LoadingButton>
            }
          />
        );
      case APPROVE_PROJECT:
        return (
          <ConfirmDialog
            open={confirming.value}
            onClose={onClose}
            closeAfterTransition
            title="Xác nhận duyệt dự án này?"
            content={
              <>
                Xác nhận <u>duyệt dự án</u> <strong>{projectSelected?.name}</strong>? Lưu ý, thao
                này không thể hoàn tác.
              </>
            }
            action={
              <LoadingButton
                variant="outlined"
                color="primary"
                loading={isProcessing.value}
                onClick={handleApprove}
              >
                Duyệt
              </LoadingButton>
            }
          />
        );
      case REQUEST_EDIT_PROJECT:
        return (
          <ConfirmDialog
            open={confirming.value}
            onClose={onClose}
            closeAfterTransition
            title="Gửi Yêu cầu điều chỉnh?"
            content={
              <>
                Xác nhận <u>gửi Yêu cầu điều chỉnh</u> <strong>{projectSelected?.name}</strong>? Lưu
                ý, thao này không thể hoàn tác.
              </>
            }
            action={
              <LoadingButton
                variant="outlined"
                color="info"
                loading={isProcessing.value}
                onClick={handleRequestEdit}
              >
                Gửi yêu cầu
              </LoadingButton>
            }
          />
        );

      default:
        return null;
    }
  };

  return {
    onApprove,
    onReject,
    onRequestEdit,
    renderConfirmDialog,
    isProcessing: isProcessing.value,
  };
}
