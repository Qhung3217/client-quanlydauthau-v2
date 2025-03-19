'use client';

import type { DialogProps } from '@mui/material';
import type { Product } from 'src/types/product';

import { useState } from 'react';
import { useBoolean, useDebounce } from 'minimal-shared/hooks';

import {
  Box,
  Stack,
  Table,
  Button,
  Dialog,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  Pagination,
  DialogTitle,
  DialogActions,
  DialogContent,
  OutlinedInput,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useGetProducts } from 'src/actions/product';

import { Markdown } from 'src/components/markdown';

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
            <TableContainer>
              <Table sx={{ minWidth: 300 }} stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell size="small">Sản phẩm</TableCell>
                    <TableCell size="small">Mô tả</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
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
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        <Box width={1}>
                          <Markdown value={product.desc} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
        <Button onClick={dialogProps.onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
