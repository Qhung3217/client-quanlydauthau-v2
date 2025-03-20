import type { PaperProps } from '@mui/material';

import { Paper, IconButton, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Markdown } from 'src/components/markdown';

import type { ProductEstimateSchemaType } from './product-estimate-create-edit-form';

type Props = Omit<PaperProps, 'children'> & {
  product: ProductEstimateSchemaType;
  onRemove?: () => void;
};
export default function ProductEstimateItem({ product, onRemove, sx, ...paperProps }: Props) {
  return (
    <Paper
      sx={{
        border: '1px solid #d3d3d3',
        maxHeight: 400,
        p: 0.5,
        borderRadius: 0.5,
        position: 'relative',
        '&:hover': {
          backgroundColor: 'background.neutral',
        },
        ...(paperProps.onClick && {
          cursor: 'pointer',
        }),
        ...sx,
      }}
      {...paperProps}
    >
      {onRemove && (
        <IconButton
          size="small"
          sx={{ color: 'error.light', position: 'absolute', top: 1, right: 1 }}
          onClick={() => onRemove()}
        >
          <Iconify icon="ep:remove-filled" />
        </IconButton>
      )}
      <Typography variant="h6" gutterBottom>
        {product.name}
      </Typography>
      <Typography variant="subtitle2">Mô tả:</Typography>
      <Markdown
        value={product.desc}
        slotProps={{
          container: {
            maxHeight: 1,
          },
        }}
      />
    </Paper>
  );
}
