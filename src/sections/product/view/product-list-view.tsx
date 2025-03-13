'use client';

import type { Product } from 'src/types/product';
import type { GridRowSelectionModel } from '@mui/x-data-grid';

import { toast } from 'sonner';
import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import {
  Box,
  Menu,
  Paper,
  Button,
  Dialog,
  Divider,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
  Pagination,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { useGetProducts } from 'src/actions/product';
import { DashboardContent } from 'src/layouts/dashboard';
import { deleteProducts } from 'src/actions/product-ssr';
import { PERMISSION_ENUM } from 'src/constants/permission';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import DeleteConfirmDialog from 'src/components/data-table/delete-confirm-dialog';

import useCheckPermission from 'src/auth/hooks/use-check-permission';

export default function ProductListView() {
  const confirmDialog = useBoolean();
  const deleting = useBoolean();

  const { CREATE_PERMIT, DELETE_PERMIT, UPDATE_PERMIT } = useCheckPermission({
    CREATE_PERMIT: PERMISSION_ENUM.CREATE_PRODUCT,
    UPDATE_PERMIT: PERMISSION_ENUM.UPDATE_PRODUCT,
    DELETE_PERMIT: PERMISSION_ENUM.DELETE_PRODUCT,
  });

  const [query, setQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | any>();
  const [rowView, setRowView] = useState<Product | null>(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { products, productsLoading, productsMeta, productsEmpty } = useGetProducts({
    page: paginationModel.page + 1,
    perPage: paginationModel.pageSize - 1,
    keyword: query,
    orderKey: 'updatedAt',
    orderValue: 'desc',
  });

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const handleDeleteRow = useCallback(async (id: string) => {
    setSelectedRowIds([id]);
    confirmDialog.onTrue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickAction = (event: any, product: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleCloseAction = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleDeleteRows = useCallback(async () => {
    try {
      deleting.onTrue();
      const count = selectedRowIds.length;
      await deleteProducts(selectedRowIds as any);
      toast.success(`Xóa ${count} sản phẩm thành công!`);
      setSelectedRowIds([]);
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
  if (productsLoading) return <LoadingSkeleton />;

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Danh sách sản phẩm"
          links={[{ name: 'Sản phẩm', href: paths.product.root }, { name: 'Danh sách' }]}
          action={
            CREATE_PERMIT && (
              <Button
                component={RouterLink}
                href={paths.product.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Sản phẩm mới
              </Button>
            )
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
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
        {productsEmpty && <EmptyContent filled title="Không có sản phẩm" />}
        {!productsEmpty && (
          <>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                boxSizing: 'border-box',
              }}
            >
              {products.map((product) => (
                <Paper
                  key={product.id}
                  elevation={2}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    width: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: 150 }}>
                    <Box>
                      <Typography
                        variant="h6"
                        mb={1}
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Box component="span" sx={{ fontWeight: 'bold' }}>
                        Cập nhật
                      </Box>
                      : {fDate(product.updatedAt)}
                    </Box>
                  </Box>
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Button variant="text" onClick={(event) => handleClickAction(event, product)}>
                      <Iconify icon="mdi:dots-vertical" />
                    </Button>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseAction}
                    PaperProps={{
                      sx: {
                        boxShadow: 1,
                      },
                    }}
                  >
                    <MenuItem onClick={() => setRowView(selectedProduct)}>
                      <Iconify icon="mdi:eye" sx={{ mr: 1 }} />
                      Xem chi tiết
                    </MenuItem>
                    {UPDATE_PERMIT && (
                      <MenuItem
                        component={RouterLink}
                        href={`${paths.product.root}/${selectedProduct?.id}/edit`}
                      >
                        <Iconify icon="mdi:pencil" sx={{ mr: 1 }} />
                        Sửa
                      </MenuItem>
                    )}
                    {DELETE_PERMIT && (
                      <MenuItem onClick={() => handleDeleteRow(selectedProduct?.id)}>
                        <Iconify icon="mdi:delete" sx={{ mr: 1 }} />
                        Xóa
                      </MenuItem>
                    )}
                  </Menu>
                </Paper>
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
      </DashboardContent>
      <DeleteConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        count={selectedRowIds.length}
        confirming={deleting.value}
        onConfirm={handleDeleteRows}
      />
      <Dialog
        open={!!rowView}
        onClose={() => setRowView(null)}
        scroll="paper"
        PaperProps={{
          sx: {
            maxWidth: 'md',
            width: 1,
          },
        }}
      >
        <DialogTitle>Xem chi tiết sản phẩm</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
            }}
          >
            <Box>
              <Typography variant="h3">{rowView?.name}</Typography>
              <Divider sx={{ mt: 2, mb: 1 }} />
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Đặc tính cơ sở/đề xuất
                </Typography>
                <Box
                  dangerouslySetInnerHTML={{
                    __html: rowView?.desc || 'Chưa có mô tả',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRowView(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Skeleton cho Breadcrumbs */}
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="text" width={150} height={20} />
          </Box>
          <Skeleton variant="rounded" width={120} height={36} />
        </Box>
      </Box>

      {/* Skeleton cho Search */}
      <Box sx={{ mb: 2 }}>
        <Skeleton variant="rounded" height={40} width="100%" />
      </Box>

      {/* Skeleton cho Grid sản phẩm */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          boxSizing: 'border-box',
        }}
      >
        {[...Array(3)].map((_, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: 150, width: '100%' }}>
              <Skeleton variant="rectangular" width="30%" height={100} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            </Box>
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <Skeleton variant="circular" width={24} height={24} />
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Skeleton cho Pagination */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Skeleton variant="rounded" width={200} height={36} />
      </Box>
    </DashboardContent>
  );
}
