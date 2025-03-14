import type { DialogProps } from '@mui/material';

import { useRef } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import PriorityCreateEditForm from '../priority-create-edit-form';

type Props = Omit<DialogProps, 'children' | 'onClose'> & {
  onClose: () => void;
};

export default function PriorityCreateDialog({ onClose, ...dialogProps }: Props) {
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
      <DialogTitle>Tạo độ ưu tiên mới</DialogTitle>

      <DialogContent>
        <PriorityCreateEditForm btnRef={submitRef} onSubmit={loading.onFalse} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <LoadingButton
          loading={loading.value}
          onClick={() => {
            submitRef.current?.click();
            loading.onTrue();
          }}
          variant="contained"
        >
          Thêm mới
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
