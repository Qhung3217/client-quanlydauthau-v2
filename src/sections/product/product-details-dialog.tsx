import type { DialogProps } from '@mui/material';
import type { Product } from 'src/types/product';

import {
  Box,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import Markdown from 'src/components/markdown/markdown';

type Props = Omit<DialogProps, 'children' | 'onClose'> & {
  onClose: () => void;
  product?: Product;
};
export default function ProductDetailsDialog({ product, onClose, ...dialogProps }: Props) {
  return (
    <Dialog
      onClose={onClose}
      scroll="paper"
      PaperProps={{
        sx: {
          maxWidth: 'md',
          width: 1,
        },
      }}
      {...dialogProps}
    >
      <DialogTitle sx={{ pb: 1 }}>Xem chi tiết sản phẩm</DialogTitle>
      <DialogContent>
        <Typography variant="h4">{product?.name}</Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle1" sx={{ color: 'primary.darker' }}>
            Mô tả
          </Typography>
          <Markdown
            value={product?.desc}
            slotProps={{
              container: {
                border: '1px dashed #D9EAFD',
                borderRadius: 0.5,
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
