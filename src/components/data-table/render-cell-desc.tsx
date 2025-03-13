import type { GridCellParams } from '@mui/x-data-grid';

import { Box } from '@mui/material';

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellDesc({ params }: ParamsProps) {
  return (
    <Box component="span" sx={{ fontStyle: 'italic' }}>
      {params.row.desc || ''}
    </Box>
  );
}
