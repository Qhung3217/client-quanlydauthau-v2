'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import LoadingButton from '@mui/lab/LoadingButton';

import { shortenTextInMiddle } from 'src/utils/format-string';

import { rejectEstimate, approveEstimate, requestEditEstimate } from 'src/actions/estimate-ssr';

import { ConfirmDialog } from 'src/components/custom-dialog';

const APPROVE_ESTIMATE = 'APPROVE_ESTIMATE';
const REJECT_ESTIMATE = 'REJECT_ESTIMATE';
const REQUEST_EDIT_ESTIMATE = 'REQUEST_EDIT_ESTIMATE';

export default function useEstimateActions() {
  const [estimateSelected, setEstimateSelected] = useState<{ id: string; name: string } | null>(
    null
  );
  const [action, setAction] = useState('');

  const isProcessing = useBoolean();

  const confirming = useBoolean();

  const onApprove = (selected: { id: string; name: string }) => {
    confirming.onTrue();
    setAction(APPROVE_ESTIMATE);
    setEstimateSelected(selected);
  };

  const onReject = (selected: { id: string; name: string }) => {
    confirming.onTrue();
    setAction(REJECT_ESTIMATE);
    setEstimateSelected(selected);
  };

  const onRequestEdit = (selected: { id: string; name: string }) => {
    confirming.onTrue();
    setAction(REQUEST_EDIT_ESTIMATE);
    setEstimateSelected(selected);
  };

  const onClose = () => {
    confirming.onFalse();
    setTimeout(() => {
      setAction('');
    });
  };
  const handleApprove = async () => {
    if (!estimateSelected) return;
    try {
      isProcessing.onTrue();
      await approveEstimate(estimateSelected.id);
      toast.success(`Dự toán ${shortenTextInMiddle(estimateSelected.name, 30)} duyệt thành công.`);
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra.');
    } finally {
      confirming.onFalse();
      isProcessing.onFalse();
    }
  };
  const handleReject = async () => {
    if (!estimateSelected) return;
    try {
      isProcessing.onTrue();
      await rejectEstimate(estimateSelected.id);
      toast.success(`Hủy dự án ${shortenTextInMiddle(estimateSelected.name, 30)} thành công.`);
    } catch {
      toast.error('Đã có lỗi xảy ra.');
    } finally {
      confirming.onFalse();
      isProcessing.onFalse();
    }
  };

  const handleRequestEdit = async () => {
    if (!estimateSelected) return;
    try {
      isProcessing.onTrue();
      await requestEditEstimate(estimateSelected.id);
      toast.success(
        `Đã gửi Yêu cầu điều chỉnh dự án ${shortenTextInMiddle(estimateSelected.name, 30)} .`
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
      case REJECT_ESTIMATE:
        return (
          <ConfirmDialog
            open={confirming.value}
            onClose={onClose}
            closeAfterTransition
            title="Hủy dự toán này?"
            content={
              <>
                Xác nhận <u>hủy dự toán</u> <strong>{estimateSelected?.name}</strong>? Lưu ý, thao
                này không thể hoàn tác.
              </>
            }
            action={
              <LoadingButton
                variant="outlined"
                color="warning"
                loading={isProcessing.value}
                onClick={handleReject}
              >
                Hủy dự toán
              </LoadingButton>
            }
          />
        );
      case APPROVE_ESTIMATE:
        return (
          <ConfirmDialog
            open={confirming.value}
            onClose={onClose}
            closeAfterTransition
            title="Xác nhận duyệt dự toán này?"
            content={
              <>
                Xác nhận <u>duyệt dự toán</u> <strong>{estimateSelected?.name}</strong>? Lưu ý, thao
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
      case REQUEST_EDIT_ESTIMATE:
        return (
          <ConfirmDialog
            open={confirming.value}
            onClose={onClose}
            closeAfterTransition
            title="Gửi Yêu cầu điều chỉnh?"
            content={
              <>
                Xác nhận <u>gửi Yêu cầu điều chỉnh</u> <strong>{estimateSelected?.name}</strong>? Lưu
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
