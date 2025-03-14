import type { DialogProps } from '@mui/material';
import type { Priority } from 'src/types/priority';

import { useRef } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import PriorityCreateEditForm from '../priority-create-edit-form';

type Props = Omit<DialogProps, 'children' | 'onClose'> & {
  onClose: () => void;
  currentRecord: Priority;
};

export default function PriorityEditDialog({ currentRecord, onClose, ...dialogProps }: Props) {
  const submitRef = useRef<HTMLButtonElement | null>(null);

  const loading = useBoolean();
  if (!currentRecord) return null;

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
      <DialogTitle>Cập nhật độ ưu tiên</DialogTitle>

      <DialogContent>
        <PriorityCreateEditForm
          btnRef={submitRef}
          onSubmit={loading.onFalse}
          currentRecord={currentRecord}
        />
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
          Lưu thay đổi
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
