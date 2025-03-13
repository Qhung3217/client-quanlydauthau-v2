import type { GridSlotProps, GridRowSelectionModel } from '@mui/x-data-grid';
import type { TableQuickFilterProps } from 'src/components/data-table/table-quick-filter';

import { Box, Button } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid';

import { Iconify } from 'src/components/iconify';
import TableQuickFilter from 'src/components/data-table/table-quick-filter';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  }
}

type CustomToolbarProps = Omit<GridSlotProps['toolbar'], 'setFilterButtonEl'> &
  TableQuickFilterProps & {
    selectedRowIds: GridRowSelectionModel;
    onOpenConfirmDeleteRows: () => void;
  };

export default function RoleTableToolbar({
  selectedRowIds,
  onOpenConfirmDeleteRows,
  onChange,
  onReset,
  value,
}: CustomToolbarProps) {
  return (
    <GridToolbarContainer>
      <TableQuickFilter value={value} onChange={onChange} onReset={onReset} />

      <Box
        sx={{
          gap: 1,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {!!selectedRowIds.length && (
          <Button
            size="small"
            color="error"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={onOpenConfirmDeleteRows}
          >
            Xóa ({selectedRowIds.length})
          </Button>
        )}
      </Box>
    </GridToolbarContainer>
  );
}
