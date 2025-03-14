import { Box, Paper, Skeleton } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

export default function ProductListSkeleton() {
  return (
    <DashboardContent sx={{}}>
      {/* Skeleton cho Grid sản phẩm */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {[...Array(3)].map((_, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            </Box>
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <Skeleton variant="circular" width={24} height={24} />
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Skeleton cho Pagination */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Skeleton variant="rounded" width={200} height={36} />
      </Box>
    </DashboardContent>
  );
}
