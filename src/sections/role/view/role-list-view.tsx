'use client';

import type { PermissionInRole } from 'src/types/permission';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

import { toast } from 'sonner';
import { useMemo, useState, useCallback } from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';

import {
  Paper,
  Table,
  Button,
  Popover,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetRoles } from 'src/actions/role';
import { deleteRoles } from 'src/actions/role-ssr';
import { DashboardContent } from 'src/layouts/dashboard';
import { PERMISSION_ENUM } from 'src/constants/permission';

import { Iconify } from 'src/components/iconify';
import DataTable from 'src/components/data-table/data-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import DeleteConfirmDialog from 'src/components/data-table/delete-confirm-dialog';

import { useCheckPermission } from 'src/auth/hooks';

import { getColumns } from '../role-table-columns';
import RoleTableToolbar from '../role-table-toolbar';

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

export default function RoleListView() {
  const confirmDialog = useBoolean();

  const deleting = useBoolean();

  const [query, setQuery] = useState('');

  const { CREATE_PERMIT, DELETE_PERMIT, UPDATE_PERMIT } = useCheckPermission({
    CREATE_PERMIT: PERMISSION_ENUM.CREATE_ROLE,
    UPDATE_PERMIT: PERMISSION_ENUM.UPDATE_ROLE,
    DELETE_PERMIT: PERMISSION_ENUM.DELETE_ROLE,
  });
  const permissionPopover = usePopover();

  const [permissionsSelect, setPermissionsSelect] = useState<PermissionInRole[]>([]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { roles, rolesLoading, rolesMeta } = useGetRoles({
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
      await deleteRoles(selectedRowIds as any);
      toast.success(`Xóa ${count} nhóm quyền thành công!`);
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
      <RoleTableToolbar
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

  const handlePermissionsPopover = useCallback(
    (event: any, selected: any[]) => {
      permissionPopover.onOpen(event);
      setPermissionsSelect(selected);
    },
    [permissionPopover]
  );

  const columns: GridColDef[] = useMemo(
    () =>
      getColumns({
        onDelete: handleDeleteRow,
        onPermissionClick: handlePermissionsPopover,
        permit: {
          update: UPDATE_PERMIT,
          delete: DELETE_PERMIT,
        },
      }),
    [handlePermissionsPopover, handleDeleteRow, UPDATE_PERMIT, DELETE_PERMIT]
  );

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);
  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Danh sách nhóm quyền"
          links={[{ name: 'Nhóm quyền', href: paths.role.root }, { name: 'Danh sách' }]}
          action={
            CREATE_PERMIT && (
              <Button
                component={RouterLink}
                href={paths.role.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Nhóm quyền mới
              </Button>
            )
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <DataTable
          rows={roles}
          columns={columns}
          loading={rolesLoading}
          paginationModel={paginationModel}
          totalRowCount={rolesMeta?.total}
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

      <Popover
        open={permissionPopover.open}
        anchorEl={permissionPopover.anchorEl}
        onClose={permissionPopover.onClose}
        disableRestoreFocus
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        slotProps={{
          paper: {
            sx: {
              background: 'white',
            },
          },
        }}
      >
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Mã quyền</TableCell>
                <TableCell>Quyền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissionsSelect.map((row) => (
                <TableRow key={row.code + row.name}>
                  <TableCell component="th">{row.code}</TableCell>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Popover>
      <DeleteConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        count={selectedRowIds.length}
        confirming={deleting.value}
        onConfirm={handleDeleteRows}
      />
    </>
  );
}
