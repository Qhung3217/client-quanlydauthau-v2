'use client';

import { m } from 'framer-motion';

import { Button, Container, Typography } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export const metadata = { title: `404! Không tìm thấy dữ liệu này` };

export default function Page() {
  return (
    <Container component={MotionContainer}>
      <m.div variants={varBounce('in')}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Không tìm thấy dữ liệu này!
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <Typography sx={{ color: 'text.secondary' }}>
          Dữ liệu này có thể đã bị ẩn hoặc không tồn tại
        </Typography>
      </m.div>

      {/* <m.div variants={varBounce('in')}>
        <PageNotFoundIllustration sx={{ my: { xs: 5, sm: 10 } }} />
      </m.div> */}

      <Button component={RouterLink} href="/" size="large" variant="contained">
        Quay lại trang chủ
      </Button>
    </Container>
  );
}
