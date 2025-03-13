'use client';

import type { DataGridProps } from '@mui/x-data-grid';

import { useRef, useMemo } from 'react';

import { Card } from '@mui/material';
import { viVN } from '@mui/x-data-grid/locales';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { EmptyContent } from 'src/components/empty-content';

type Props = Omit<DataGridProps, 'rowCount'> & {
  totalRowCount: number | undefined;
};
export default function DataTable({ totalRowCount, sx, slots, slotProps, ...props }: Props) {
  const rowCountRef = useRef(totalRowCount || 0);

  const rowCount = useMemo(() => {
    if (totalRowCount !== undefined) {
      rowCountRef.current = totalRowCount;
    }
    return rowCountRef.current;
  }, [totalRowCount]);
  return (
    <Card
      sx={{
        minHeight: 640,
        flexGrow: { md: 1 },
        display: { md: 'flex' },
        height: { xs: 800, md: '1px' },
        flexDirection: { md: 'column' },
      }}
    >
      <DataGrid
        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
        checkboxSelection
        disableRowSelectionOnClick
        keepNonExistentRowsSelected
        getRowHeight={() => 'auto'}
        pageSizeOptions={[5, 10, 20, 50]}
        rowCount={rowCount}
        paginationMode="server"
        initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        slots={{
          noRowsOverlay: () => <EmptyContent />,
          noResultsOverlay: () => <EmptyContent title="Không có kết quả" />,
          ...slots,
        }}
        slotProps={slotProps}
        sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' }, ...sx }}
        {...props}
      />
    </Card>
  );
}
