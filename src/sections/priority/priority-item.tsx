import type { Priority } from 'src/types/priority';

import { usePopover } from 'minimal-shared/hooks';

import { Box, Card, Menu, MenuItem, IconButton, Typography } from '@mui/material';

import getPriorityColorConfig from 'src/helpers/get-priority-color-config';

import { PERMISSION_ENUM } from 'src/constants/permission';

import { Iconify } from 'src/components/iconify';

import { useCheckPermission } from 'src/auth/hooks';

type Props = {
  priority: Priority;

  onEdit: (priority: Priority) => void;
  onDelete: (priority: Priority) => void;
};

export default function PriorityItem({ priority, onEdit, onDelete }: Props) {
  const { color, bgColor } = getPriorityColorConfig(priority.color);
  const popover = usePopover();
  const { UPDATE_PERMIT, DELETE_PERMIT } = useCheckPermission({
    UPDATE_PERMIT: PERMISSION_ENUM.UPDATE_PRIORITY,
    DELETE_PERMIT: PERMISSION_ENUM.DELETE_PRIORITY,
  });
  return (
    <Card sx={{ height: 80, borderRadius: 1, py: 1, px: 2, position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 6,
          height: 1,
          backgroundColor: color,
          boxShadow: `0px 0px 4px 8px ${bgColor}`,
        }}
      />
      <Typography>{priority.name}</Typography>
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
        {UPDATE_PERMIT && (
          <MenuItem
            onClick={(event) => {
              event.stopPropagation();
              popover.onClose();
              onEdit(priority);
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
              onDelete(priority);
              popover.onClose();
            }}
          >
            <Iconify icon="mdi:delete" sx={{ mr: 1 }} />
            Xóa
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
}
