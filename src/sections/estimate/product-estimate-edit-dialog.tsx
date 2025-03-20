import { useRef } from 'react';

import {
  Stack,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import ProductEstimateCreateEditForm from './product-estimate-create-edit-form';

import type { ProductEstimateSchemaType } from './product-estimate-create-edit-form';

type Props = {
  open: boolean;
  onClose: () => void;
  product?: ProductEstimateSchemaType;
  onSubmit: (data: ProductEstimateSchemaType) => void;
};
export default function ProductEstimateEditDialog({ open, onClose, product, onSubmit }: Props) {
  const submitRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Dialog open={open} onClose={onClose} closeAfterTransition disableScrollLock>
      <DialogTitle>
        Cập nhật hàng hóa
        <Stack direction="row" sx={{ typography: 'body1' }} alignItems="center">
          <Iconify icon="bi:dot" />
          <Typography variant="inherit">{product?.name}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ py: 0.5 }}>
        <ProductEstimateCreateEditForm
          currentRecord={product}
          onSubmit={onSubmit}
          btnRef={submitRef}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={() => {
            submitRef.current?.click();
            onClose();
          }}
          variant="contained"
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
}
