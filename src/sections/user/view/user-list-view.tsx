'use client';

import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

import { toast } from 'sonner';
import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useCallback } from 'react';

import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetUsers } from 'src/actions/user';
import { deleteUsers } from 'src/actions/user-ssr';
import { DashboardContent } from 'src/layouts/dashboard';
import { PERMISSION_ENUM } from 'src/constants/permission';

import { Iconify } from 'src/components/iconify';
import DataTable from 'src/components/data-table/data-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import DeleteConfirmDialog from 'src/components/data-table/delete-confirm-dialog';

import useCheckPermission from 'src/auth/hooks/use-check-permission';

import { getColumns } from '../user-table-columns';
import UserTableToolbar from '../user-table-toolbar';
import UserResetPasswordDialog from '../user-reset-password-dialog';

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

export default function UserListView() {
  const confirmDialog = useBoolean();

  const { CREATE_PERMIT, DELETE_PERMIT, UPDATE_PERMIT } = useCheckPermission({
    CREATE_PERMIT: PERMISSION_ENUM.CREATE_USER,
    UPDATE_PERMIT: PERMISSION_ENUM.UPDATE_USER,
    DELETE_PERMIT: PERMISSION_ENUM.DELETE_USER,
  });

  const deleting = useBoolean();

  const [query, setQuery] = useState('');

  const [rowResetPwd, setRowResetPwd] = useState<{ id: string; username: string } | null>(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { users, usersLoading, usersMeta } = useGetUsers({
    page: paginationModel.page + 1,
    perPage: paginationModel.pageSize,
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

  const handleDeleteRows = useCallback(async () => {
    try {
      deleting.onTrue();
      const count = selectedRowIds.length;
      await deleteUsers(selectedRowIds as any);
      toast.success(`Xóa ${count} tài khoản thành công!`);
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

  const CustomToolbarCallback = useCallback(
    () => (
      <UserTableToolbar
        selectedRowIds={selectedRowIds}
        onOpenConfirmDeleteRows={confirmDialog.onTrue}
        value={query}
        onChange={setQuery as any}
        onReset={() => setQuery('')}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedRowIds, query, setQuery]
  );

  const columns: GridColDef[] = useMemo(
    () =>
      getColumns({
        onDelete: handleDeleteRow,
        onResetPassword: (id, username) =>
          setRowResetPwd({
            id,
            username,
          }),
        permit: {
          update: UPDATE_PERMIT,
          delete: DELETE_PERMIT,
        },
      }),
    [handleDeleteRow, UPDATE_PERMIT, DELETE_PERMIT]
  );

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);
  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Danh sách tài khoản"
          links={[{ name: 'Tài khoản', href: paths.user.root }, { name: 'Danh sách' }]}
          action={
            CREATE_PERMIT && (
              <Button
                component={RouterLink}
                href={paths.user.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Tài khoản mới
              </Button>
            )
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <DataTable
          rows={users}
          columns={columns}
          loading={usersLoading}
          paginationModel={paginationModel}
          totalRowCount={usersMeta?.total}
          onPaginationModelChange={setPaginationModel}
          onRowSelectionModelChange={(newSelectionModel: any) =>
            setSelectedRowIds(newSelectionModel)
          }
          slots={{
            toolbar: CustomToolbarCallback,
          }}
          slotProps={{
            columnsManagement: { getTogglableColumns },
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: paginationModel.page,
              },
            },
          }}
        />
      </DashboardContent>
      <DeleteConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        count={selectedRowIds.length}
        confirming={deleting.value}
        onConfirm={handleDeleteRows}
      />

      <UserResetPasswordDialog
        open={!!rowResetPwd}
        onClose={() => {
          setRowResetPwd(null);
        }}
        accountId={rowResetPwd?.id}
        username={rowResetPwd?.username}
      />
    </>
  );
}
