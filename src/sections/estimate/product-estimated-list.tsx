import { Box, Paper, Stack, Typography } from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar';

import ProductEstimateItem from './product-estimate-item';

import type { ProductEstimateSchemaType } from './product-estimate-create-edit-form';

type Props = {
  productEsts: ProductEstimateSchemaType[];
  selectedIndex?: number;
  onSelected: (productEst: ProductEstimateSchemaType, index: number) => void;
  onRemove: (index: number) => void;
};

export default function ProductEstimatedList({
  productEsts,
  onSelected,
  selectedIndex,
  onRemove,
}: Props) {
  const isEmpty = !productEsts.length;

  const emptyPanel = () => (
    <Paper
      sx={{
        alignContent: 'center',
        textAlign: 'center',

        height: 120,
        border: (theme) => `1px dashed ${theme.palette.primary.light}`,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Bạn chưa nhập dự toán nào!
      </Typography>
      <Typography variant="body2">Hãy nhập thông tin vào form để nhập dự toán</Typography>
    </Paper>
  );
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 0' }}>
      <Typography
        variant="h6"
        sx={{ color: 'primary.darker', textDecoration: 'underline' }}
        gutterBottom
      >
        Danh sách dự toán ({productEsts.length})
      </Typography>

      {isEmpty ? (
        emptyPanel()
      ) : (
        <Scrollbar sx={{ flex: '1 1 0' }}>
          <Stack spacing={2} sx={{ py: 1 }}>
            {productEsts.map((product, index) => (
              <ProductEstimateItem
                key={`${product}-${index}`}
                product={product}
                onClick={() => onSelected(product, index)}
                onRemove={() => onRemove(index)}
                sx={{
                  ...(selectedIndex === index && {
                    backgroundColor: '#f6f6f6',
                    borderColor: 'primary.main',
                  }),
                }}
              />
            ))}
          </Stack>
        </Scrollbar>
      )}
    </Box>
  );
}
