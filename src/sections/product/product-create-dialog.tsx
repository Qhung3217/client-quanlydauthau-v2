import type { DialogProps } from '@mui/material';

import { useRef } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { ProductNewEditForm } from './product-new-edit-form';

type Props = Omit<DialogProps, 'children' | 'onClose'> & {
  onClose: () => void;
};

export default function ProductCreateDialog({ onClose, ...dialogProps }: Props) {
  const submitRef = useRef<HTMLButtonElement | null>(null);

  const loading = useBoolean();

  return (
    <Dialog
      {...dialogProps}
      PaperProps={{
        sx: {
          maxWidth: 'md',
          width: 1,
        },
      }}
      onClose={onClose}
    >
      <DialogTitle>Thêm sản phẩm mới</DialogTitle>

      <DialogContent>
        <ProductNewEditForm
          btnRef={submitRef}
          onSubmit={() => {
            onClose();
          }}
          onLoading={loading.setValue}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <LoadingButton
          type="button"
          loading={loading.value}
          onClick={(event) => {
            event.stopPropagation();
            submitRef.current?.click();
          }}
          variant="contained"
        >
          Thêm sản phẩm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
