'use client';

import type { DialogProps } from '@mui/material';
import type { Product } from 'src/types/product';

import { useState } from 'react';
import { useBoolean, useDebounce } from 'minimal-shared/hooks';

import {
  Box,
  Stack,
  Button,
  Dialog,
  Typography,
  Pagination,
  DialogTitle,
  DialogActions,
  DialogContent,
  OutlinedInput,
  CircularProgress,
} from '@mui/material';

import { useGetProducts } from 'src/actions/product';

import ProductCreateDialog from './product-create-dialog';

type Props = Omit<DialogProps, 'children' | 'onClose'> & {
  onClose: () => void;
  onSelected: (value: Product) => void;
};

export default function ProductSelectDialog({ onSelected, ...dialogProps }: Props) {
  const [page, setPage] = useState(1);

  const [inputText, setInputValue] = useState('');

  const inputValueDebounce = useDebounce(inputText, 500);

  const openForm = useBoolean();

  const { products, productsLoading, productsMeta, productsEmpty } = useGetProducts({
    perPage: 20,
    page,
    keyword: inputValueDebounce,
  });
  return (
    <Dialog
      PaperProps={{
        sx: {
          maxWidth: 'md',
          width: 1,
        },
      }}
      {...dialogProps}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="inherit"> Chọn sản phẩm</Typography>
        <Button onClick={openForm.onTrue} variant="soft" color="info">
          Thêm sản phẩm
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <OutlinedInput
            value={inputText}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Tìm kiếm sản phẩm"
            fullWidth
            size="small"
          />
        </Box>
        {productsLoading && (
          <Stack alignItems="center" justifyContent="center" sx={{ height: 200 }}>
            <CircularProgress />
          </Stack>
        )}
        {!productsEmpty && (
          <>
            <Stack>
              {products.map((product) => (
                <Box
                  key={product.id}
                  width={1}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'background.neutral',
                    },
                    py: 1,
                    px: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: `1px solid #f4f4f4`,
                  }}
                  onClick={() => onSelected(product)}
                >
                  <Typography variant="subtitle1">{product.name}</Typography>
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: product.desc,
                    }}
                    sx={{ maxHeight: 200, overflow: 'auto' }}
                  />
                </Box>
              ))}
            </Stack>
            <Pagination
              count={productsMeta?.totalPages || 0}
              page={page}
              onChange={(event, pg) => setPage(pg)}
              sx={{
                mt: 2,
                '& .MuiPagination-ul': {
                  justifyContent: 'center',
                },
              }}
            />
          </>
        )}
        <ProductCreateDialog open={openForm.value} onClose={openForm.onFalse} />
      </DialogContent>
      <DialogActions>
        <Button onClick={dialogProps.onClose}>Hủy</Button>
        <Button variant="contained">Chọn</Button>
      </DialogActions>
    </Dialog>
  );
}
