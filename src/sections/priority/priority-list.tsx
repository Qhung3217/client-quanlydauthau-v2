import type { Priority } from 'src/types/priority';

import { toast } from 'sonner';
import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Box, Stack, Pagination, CircularProgress } from '@mui/material';

import { useGetPriorities } from 'src/actions/priority';
import { deletePriority } from 'src/actions/priority-ssr';

import { EmptyContent } from 'src/components/empty-content';
import TableQuickFilter from 'src/components/data-table/table-quick-filter';
import DeleteConfirmDialog from 'src/components/data-table/delete-confirm-dialog';

import PriorityItem from './priority-item';
import PriorityEditDialog from './view/priority-edit-dialog';

export default function PriorityList() {
  const [query, setQuery] = useState('');

  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 10,
  });

  const [selectedRow, setSelectedRow] = useState<Priority | null>(null);

  const { priorities, prioritiesLoading, prioritiesEmpty, prioritiesMeta } = useGetPriorities({
    page: paginationModel.page,
    perPage: paginationModel.pageSize,
    keyword: query,
    orderKey: 'updatedAt',
    orderValue: 'desc',
  });

  const deleting = useBoolean();

  const confirmDialog = useBoolean();

  const openEdit = useBoolean();

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginationModel((prev) => ({ ...prev, page: value - 1 }));
  };

  const handleDeleteRow = async () => {
    try {
      deleting.onTrue();
      await deletePriority(selectedRow!.id);
      toast.success(`Xóa độ ưu tiên thành công!`);
      setSelectedRow(null);
      confirmDialog.onFalse();
    } catch (error) {
      console.log(error);
      toast.error(`Đã có lỗi xảy ra!`);
    } finally {
      deleting.onFalse();
    }
  };
  return (
    <Box>
      <Box sx={{ mb: 2, width: 1 }}>
        <TableQuickFilter
          value={query}
          onChange={setQuery}
          onReset={() => setQuery('')}
          slotProps={{
            container: {
              maxWidth: 1,
            },
          }}
        />
      </Box>
      {prioritiesEmpty && <EmptyContent title="Danh sách rỗng!" />}
      {prioritiesLoading && (
        <Stack
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 200,
          }}
        >
          <CircularProgress size={70} />
        </Stack>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2,1fr)',
            md: 'repeat(4,1fr)',
          },
          gap: 2,
        }}
      >
        {priorities.map((priority) => (
          <PriorityItem
            key={priority.id}
            priority={priority}
            onDelete={() => {
              setSelectedRow(priority);
              confirmDialog.onTrue();
            }}
            onEdit={() => {
              setSelectedRow(priority);
              openEdit.onTrue();
            }}
          />
        ))}
      </Box>
      {!prioritiesEmpty && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={prioritiesMeta?.totalPages}
            page={paginationModel.page + 1}
            onChange={handlePageChange}
          />
        </Box>
      )}
      <DeleteConfirmDialog
        open={confirmDialog.value}
        onClose={() => {
          confirmDialog.onFalse();

          setSelectedRow(null);
        }}
        count={1}
        confirming={deleting.value}
        onConfirm={handleDeleteRow}
      />
      <PriorityEditDialog
        open={openEdit.value}
        onClose={() => {
          openEdit.onFalse();

          setSelectedRow(null);
        }}
        currentRecord={selectedRow!}
        onSubmit={() => {
          openEdit.onFalse();

          setSelectedRow(null);
        }}
      />
    </Box>
  );
}
