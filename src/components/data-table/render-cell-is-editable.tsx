import type { GridCellParams } from '@mui/x-data-grid';

import { Box } from '@mui/material';

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellIsEditable({ params }: ParamsProps) {
  return (
    <Box component="span" sx={{ color: params.row.isEditable ? 'green' : 'gray' }}>
      {params.row.isEditable ? 'Cho phép' : 'Không'}
    </Box>
  );
}
