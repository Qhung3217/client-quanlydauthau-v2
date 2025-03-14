import type { Product } from 'src/types/product';
import type { GridRowSelectionModel } from '@mui/x-data-grid';

import { toast } from 'sonner';
import { useState, useCallback } from 'react';
import { useBoolean, useDebounce } from 'minimal-shared/hooks';

import { Box, useTheme, TextField, Pagination, useMediaQuery, InputAdornment } from '@mui/material';

import { useGetProducts } from 'src/actions/product';
import { deleteProducts } from 'src/actions/product-ssr';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import DeleteConfirmDialog from 'src/components/data-table/delete-confirm-dialog';

import ProductListItem from './product-list-item';
import ProductListSkeleton from './product-list-skeleton';
import ProductDetailsDialog from './product-details-dialog';

type Props = {
  onSelected?: (product: Product) => void;
  resetSelected?: () => void;
};
export default function ProductList({ onSelected, resetSelected }: Props) {
  const [query, setQuery] = useState('');

  const [rowView, setRowView] = useState<Product | null>(null);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const queryDebounce = useDebounce(query, 400);

  const theme = useTheme();

  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const deleting = useBoolean();

  const confirmDialog = useBoolean();

  const { products, productsLoading, productsMeta, productsEmpty } = useGetProducts({
    page: paginationModel.page + 1,
    perPage: paginationModel.pageSize - 1,
    keyword: queryDebounce,
    orderKey: 'updatedAt',
    orderValue: 'desc',
  });

  const handleDeleteRows = useCallback(async () => {
    try {
      deleting.onTrue();
      const count = selectedRowIds.length;
      await deleteProducts(selectedRowIds as any);
      toast.success(`Xóa ${count} sản phẩm thành công!`);
      setSelectedRowIds([]);
      resetSelected?.();
      confirmDialog.onFalse();
    } catch (error) {
      console.log(error);
      toast.error(`Đã có lỗi xảy ra!`);
    } finally {
      deleting.onFalse();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRowIds]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginationModel((prev) => ({ ...prev, page: value - 1 }));
  };
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Tìm kiếm sản phẩm..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
          value={query}
          onChange={handleSearchChange}
          fullWidth
          size="small"
        />
      </Box>
      {productsLoading && <ProductListSkeleton />}
      {productsEmpty && <EmptyContent title="Không có sản phẩm" sx={{ maxHeight: 400 }} />}
      {!productsEmpty && !productsLoading && (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {products.map((product) => (
              <ProductListItem
                key={product.id}
                product={product}
                onDelete={() => {
                  confirmDialog.onTrue();
                  setSelectedRowIds([product.id]);
                }}
                onView={() => {
                  setRowView(product);
                  onSelected?.(product);
                }}
                selected={rowView?.id === product.id}
              />
            ))}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={productsMeta?.totalPages}
              page={paginationModel.page + 1}
              onChange={handlePageChange}
            />
          </Box>
        </>
      )}
      <DeleteConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        count={selectedRowIds.length}
        confirming={deleting.value}
        onConfirm={handleDeleteRows}
      />
      {!mdUp && (
        <ProductDetailsDialog
          open={!!rowView}
          onClose={() => setRowView(null)}
          product={rowView as any}
        />
      )}
      <ProductDetailsDialog
        open={!!rowView}
        onClose={() => setRowView(null)}
        product={rowView as any}
      />
    </Box>
  );
}
