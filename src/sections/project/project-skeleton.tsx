import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import { Grid, Stack } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

type ProjectListSkeletonProps = BoxProps & {
  itemCount?: number;
  variant?: 'vertical' | 'horizontal';
};

export function ProjectListSkeleton({
  sx,
  itemCount = 16,
  variant = 'vertical',
  ...other
}: ProjectListSkeletonProps) {
  if (variant === 'horizontal') {
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

  return Array.from({ length: itemCount }, (_, index) => (
    <Box
      key={index}
      sx={[
        (theme) => ({
          display: 'flex',
          borderRadius: 2,
          flexDirection: 'column',
          bgcolor: 'background.paper',
          border: `solid 1px ${theme.vars.palette.divider}`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ p: 1 }}>
        <Skeleton sx={{ pt: '100%' }} />
      </Box>

      <Box
        sx={{
          p: 3,
          pt: 2,
          gap: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Skeleton variant="circular" sx={{ width: 40, height: 40, flexShrink: 0 }} />
        <Box
          sx={{
            gap: 1,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Skeleton sx={{ height: 10 }} />
          <Skeleton sx={{ width: 0.5, height: 10 }} />
        </Box>
      </Box>
    </Box>
  ));
}

// ----------------------------------------------------------------------

export default function ProjectDetailsSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Tiêu đề dự án */}
      <Skeleton variant="text" sx={{ fontSize: 32, width: '30%' }} />
      <Skeleton variant="text" sx={{ width: '15%' }} />

      {/* Thanh trạng thái tiến trình */}
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="circular" width={24} height={24} />
      </Stack>

      {/* Các nút thao tác */}
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Skeleton variant="rectangular" width={120} height={40} />
        <Skeleton variant="rectangular" width={180} height={40} />
      </Stack>

      {/* Thông tin dự án */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        <Skeleton variant="text" sx={{ width: '20%', height: 30 }} />
        <Skeleton variant="text" sx={{ width: '50%' }} />
        <Skeleton variant="text" sx={{ width: '40%' }} />
        <Skeleton variant="text" sx={{ width: '30%' }} />
        <Skeleton variant="text" sx={{ width: '50%', color: 'red' }} />
      </Box>

      {/* Danh sách dự toán */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        <Skeleton variant="text" sx={{ width: '20%', height: 30 }} />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {[...Array(2)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                }}
              >
                <Skeleton variant="text" sx={{ width: '30%' }} />
                <Skeleton variant="text" sx={{ width: '50%' }} />
                <Skeleton variant="text" sx={{ width: '40%' }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
