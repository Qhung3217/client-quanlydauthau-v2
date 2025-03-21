'use client';

import type { EstimateDetails } from 'src/types/estimate';

import { useRef } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { EstimateCreateEditForm } from './estimate-create-edit-form';

import type { ProductEstimateSchemaType } from './product-estimate-create-edit-form';

type Props = {
  open: boolean;
  onClose: () => void;
  productEstimates: ProductEstimateSchemaType[];
  projectId: string;
  currentRecord?: EstimateDetails;
};

export default function EstimateCreateEditDialog({
  currentRecord,
  open,
  onClose,
  productEstimates,
  projectId,
}: Props) {
  const isEdit = !!currentRecord;

  const submitRef = useRef<HTMLButtonElement | null>(null);

  const loading = useBoolean();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      closeAfterTransition
      disableScrollLock
      PaperProps={{
        sx: {
          maxWidth: 500,
          width: 1,
        },
      }}
    >
      <DialogTitle>{isEdit ? 'Điều chỉnh dự toán' : 'Gửi dự toán'}</DialogTitle>
      <DialogContent sx={{ py: 1 }}>
        <EstimateCreateEditForm
          currentRecord={currentRecord}
          projectId={projectId}
          productEstimates={productEstimates}
          btnRef={submitRef}
          onLoading={loading.setValue}
          onSubmit={onClose}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <LoadingButton
          onClick={() => {
            submitRef.current?.click();
            onClose();
          }}
          variant="soft"
          loading={loading.value}
          color={isEdit ? 'warning' : 'primary'}
          startIcon={ <Iconify width={24} icon="material-symbols:send-outline" />}
        >
          {isEdit ? 'Gửi điều chỉnh' : 'Gửi dự toán'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
