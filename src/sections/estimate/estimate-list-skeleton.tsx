import type { BoxProps } from '@mui/material';

import { Box, Skeleton } from '@mui/material';

type Props = BoxProps & {
  itemCount?: number;
};

export default function EstimateListSkeleton({ sx, itemCount = 8, ...other }: Props) {
  return Array.from({ length: itemCount }, (_, index) => (
    <Box
      key={index}
      sx={[
        (theme) => ({
          display: 'flex',
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: `solid 1px ${theme.vars.palette.divider}`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          p: 3,
          gap: 2,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Skeleton sx={{ width: 24, height: 12 }} />
        </Box>

        <Skeleton sx={{ width: 1, height: 10 }} />
        <Skeleton sx={{ width: `calc(100% - 40px)`, height: 10 }} />
        <Skeleton sx={{ width: `calc(100% - 80px)`, height: 10 }} />
      </Box>
    </Box>
  ));
}
