'use client';

import type { Product } from 'src/types/product';

import { usePopover } from 'minimal-shared/hooks';

import { Box, Menu, Paper, MenuItem, useTheme, IconButton, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { PERMISSION_ENUM } from 'src/constants/permission';

import { Iconify } from 'src/components/iconify';
import { TextMaxLine } from 'src/components/text-max-line';

import { useCheckPermission } from 'src/auth/hooks';

type Props = {
  product: Product;
  onView: (product: Product) => void;
  onDelete: (product: Product) => void;
  selected?: boolean;
};
export default function ProductListItem({ product, selected, onView, onDelete }: Props) {
  const theme = useTheme();

  const mdUp = theme.breakpoints.up('md');
  const { UPDATE_PERMIT, DELETE_PERMIT } = useCheckPermission({
    UPDATE_PERMIT: PERMISSION_ENUM.UPDATE_PRODUCT,
    DELETE_PERMIT: PERMISSION_ENUM.DELETE_PRODUCT,
  });

  const popover = usePopover();

  return (
    <Paper
      key={product.id}
      elevation={2}
      sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        ...(mdUp && {
          cursor: 'pointer',
        }),
        ...(selected && {
          backgroundColor: 'background.neutral',
        }),
      }}
      onClick={() => {
        if (!mdUp) return;
        onView(product);
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
        <TextMaxLine variant="h6" line={2}>
          {product.name}
        </TextMaxLine>
        <Typography variant="caption">
          <strong>Ngày cập nhật:</strong> {fDateTime(product.updatedAt, 'DD/MM/YYYY HH:MM')}
        </Typography>
      </Box>
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <IconButton
          size="small"
          onClick={(event) => {
            popover.onOpen(event);

            event.stopPropagation();
          }}
        >
          <Iconify icon="mdi:dots-vertical" />
        </IconButton>
      </Box>
      <Menu
        disableRestoreFocus
        disableEnforceFocus
        disableAutoFocus
        disableAutoFocusItem
        anchorEl={popover.anchorEl}
        open={popover.open}
        onClose={(event: any) => {
          event.stopPropagation();
          popover.onClose();
        }}
        PaperProps={{
          sx: {
            boxShadow: 1,
          },
        }}
      >
        {!mdUp && (
          <MenuItem
            onClick={(event) => {
              event.stopPropagation();
              onView(product);
              popover.onClose();
            }}
            sx={{}}
          >
            <Iconify icon="mdi:eye" sx={{ mr: 1 }} />
            Xem chi tiết
          </MenuItem>
        )}
        {UPDATE_PERMIT && (
          <MenuItem
            component={RouterLink}
            href={`${paths.product.root}/${product?.id}/edit`}
            onClick={(event) => {
              event.stopPropagation();
              popover.onClose();
            }}
          >
            <Iconify icon="mdi:pencil" sx={{ mr: 1 }} />
            Sửa
          </MenuItem>
        )}
        {DELETE_PERMIT && (
          <MenuItem
            onClick={(event) => {
              event.stopPropagation();
              onDelete(product);
              popover.onClose();
            }}
          >
            <Iconify icon="mdi:delete" sx={{ mr: 1 }} />
            Xóa
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
}
