'use client';

import type { Company } from 'src/types/company';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

import { toast } from 'sonner';
import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useCallback } from 'react';

import { Link, Avatar, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { attachServerUrl } from 'src/utils/attach-server-url';

import { MainContent } from 'src/layouts/main';
import { useGetCompanies } from 'src/actions/company';
import { deleteCompanies } from 'src/actions/company-ssr';
import { PERMISSION_ENUM } from 'src/constants/permission';

import { Iconify } from 'src/components/iconify';
import DataTable from 'src/components/data-table/data-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import ViewRowDialog from 'src/components/data-table/view-row-dialog';
import DeleteConfirmDialog from 'src/components/data-table/delete-confirm-dialog';

import useCheckPermission from 'src/auth/hooks/use-check-permission';

import { getColumns } from '../company-table-columns';
import CompanyTableToolbar from '../company-table-toolbar';

const HIDE_COLUMNS_TOGGLABLE = ['actions'];

export default function CompanyListView() {
  const { CREATE_COMPANY, DELETE_COMPANY, UPDATE_COMPANY } = useCheckPermission({
    CREATE_COMPANY: PERMISSION_ENUM.CREATE_COMPANY,
    UPDATE_COMPANY: PERMISSION_ENUM.UPDATE_COMPANY,
    DELETE_COMPANY: PERMISSION_ENUM.DELETE_COMPANY,
  });

  const confirmDialog = useBoolean();

  const deleting = useBoolean();

  const [query, setQuery] = useState('');

  const [rowView, setRowView] = useState<{ label: string; value: any }[] | null>(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { companies, companiesLoading, companiesMeta } = useGetCompanies({
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
      await deleteCompanies(selectedRowIds as any);
      toast.success(`Xóa ${count} công ty thành công!`);
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
      <CompanyTableToolbar
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
        onViewClick: (data: Company) => {
          setRowView([
            {
              label: 'Logo',
              value: (
                <Avatar
                  alt={data.name}
                  src={attachServerUrl(data.logo)}
                  variant="square"
                  sx={{ width: 80, height: 80 }}
                />
              ),
            },
            {
              label: 'Mã số thuế',
              value: data.tax,
            },
            {
              label: 'Công ty',
              value: data.name,
            },
            {
              label: 'Đại diện',
              value: (
                <>
                  {data.representativePosition} - {data.representativeName}
                </>
              ),
            },
            {
              label: 'Email',
              value: data.email,
            },
            {
              label: 'Số điện thoại',
              value: data.phone,
            },
            {
              label: 'Địa chỉ',
              value: data.address,
            },
            {
              label: 'Trang chủ',
              value: (
                <Link target="_blank" href={data.website}>
                  {data.website}
                </Link>
              ),
            },
          ]);
        },
        permit: {
          update: UPDATE_COMPANY,
          delete: DELETE_COMPANY,
        },
      }),
    [handleDeleteRow, UPDATE_COMPANY, DELETE_COMPANY]
  );

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);
  return (
    <>
      <MainContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Danh sách đơn vị"
          links={[{ name: 'Đơn vị', href: paths.organization.root }, { name: 'Danh sách' }]}
          action={
            CREATE_COMPANY && (
              <Button
                component={RouterLink}
                href={paths.organization.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                Đơn vị mới
              </Button>
            )
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <DataTable
          rows={companies}
          columns={columns}
          loading={companiesLoading}
          paginationModel={paginationModel}
          totalRowCount={companiesMeta?.total}
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
      </MainContent>

      <DeleteConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        count={selectedRowIds.length}
        confirming={deleting.value}
        onConfirm={handleDeleteRows}
      />

      <ViewRowDialog open={!!rowView} onClose={() => setRowView(null)} data={rowView || []} />
    </>
  );
}
