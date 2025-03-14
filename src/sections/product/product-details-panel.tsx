import type { Product } from 'src/types/product';

import { Box, Paper, Typography } from '@mui/material';

import Markdown from 'src/components/markdown/markdown';

type Props = {
  product: Product | null;
};
export default function ProductDetailsPanel({ product }: Props) {
  if (!product)
    return (
      <Paper
        elevation={1}
        sx={{
          backgroundColor: 'background.neutral',
          alignContent: 'center',
          height: 200,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Chọn 1 sản phẩm để xem chi tiết
        </Typography>
      </Paper>
    );
  return (
    <Paper elevation={1} sx={{ backgroundColor: '#fbfcfe', p: 1 }}>
      <Typography
        variant="caption"
        sx={{ color: 'primary.darker', textTransform: 'uppercase', fontWeight: 900 }}
      >
        Xem chi tiết sản phẩm
      </Typography>
      <Typography variant="h4">{product.name}</Typography>
      <Box sx={{ mt: 1 }}>
        <Typography variant="subtitle1" sx={{ color: 'primary.darker' }}>
          Đặc tính cơ sở/đề xuất
        </Typography>
        <Markdown
          value={product.desc}
          slotProps={{
            container: {
              border: '1px dashed #D9EAFD',
              borderRadius: 0.5,
            },
          }}
        />
      </Box>
    </Paper>
  );
}
