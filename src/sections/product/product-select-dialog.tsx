'use client';

import type { DialogProps } from '@mui/material';
import type { Product } from 'src/types/product';

import { useState } from 'react';
import { useDebounce } from 'minimal-shared/hooks';

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

type Props = Omit<DialogProps, 'children' | 'onClose'> & {
  onClose: () => void;
  onSelected: (value: Product) => void;
};

export default function ProductSelectDialog({ onSelected, ...dialogProps }: Props) {
  const [page, setPage] = useState(1);

  const [inputText, setInputValue] = useState('');

  const inputValueDebounce = useDebounce(inputText, 500);

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
      <DialogTitle>Chọn sản phẩm</DialogTitle>
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
                <Stack
                  key={product.id}
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  minWidth={0}
                  minHeight={0}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'background.neutral',
                    },
                    py: 1,
                    px: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                  }}
                  onClick={() => onSelected(product)}
                >
                  <Box>
                    <Typography variant="subtitle1">{product.name}</Typography>
                    <Box
                      dangerouslySetInnerHTML={{
                        __html: product.desc,
                      }}
                      sx={{ maxHeight: 200, overflow: 'auto' }}
                    />
                  </Box>
                </Stack>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={dialogProps.onClose}>Hủy</Button>
        <Button variant="contained">Chọn</Button>
      </DialogActions>
    </Dialog>
  );
}
