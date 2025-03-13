'use client';

import type { DialogProps } from '@mui/material';

import { useState } from 'react';

import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import {
  Box,
  Stack,
  Button,
  Dialog,
  styled,
  Checkbox,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { useGetPermissionGroups } from 'src/actions/permission';

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  '&.MuiTreeItem-root': {
    marginLeft: theme.spacing(4),
  },
}));

type Props = Omit<DialogProps, 'children' | 'onClose'> & {
  onClose: () => void;
  onSelectChange?: (selected: string[]) => void;
  selected?: string[];
};

export default function RolePermissionDialog({
  onClose,
  onSelectChange,
  selected,
  ...dialogProps
}: Props) {
  const { permissions, permissionsLoading } = useGetPermissionGroups();
  const [checked, setChecked] = useState<string[]>(() => selected || []);
  const [indeterminate, setIndeterminate] = useState<{ [key: string]: boolean }>({});

  const [expanded, setExpanded] = useState<string[]>(permissions.map((group) => group.id));

  const handleToggle = (groupId: string, permissionCode?: string) => {
    let newChecked = [...checked];
    if (permissionCode) {
      // Toggle single permission
      if (newChecked.includes(permissionCode)) {
        newChecked = newChecked.filter((code) => code !== permissionCode);
      } else {
        newChecked.push(permissionCode);
      }
    } else {
      // Toggle entire group
      const group = permissions.find((g) => g.id === groupId);
      if (!group) return;
      const allPermissions = group.permissions.map((p) => p.code);
      const allChecked = allPermissions.every((p) => newChecked.includes(p));

      if (allChecked) {
        newChecked = newChecked.filter((code) => !allPermissions.includes(code));
      } else {
        newChecked = [...new Set([...newChecked, ...allPermissions])];
      }
    }

    // Update indeterminate state
    const newIndeterminate: { [key: string]: boolean } = {};
    permissions.forEach((group) => {
      const allPermissions = group.permissions.map((p) => p.code);
      const checkedPermissions = allPermissions.filter((p) => newChecked.includes(p));
      newIndeterminate[group.id] =
        checkedPermissions.length > 0 && checkedPermissions.length < allPermissions.length;
    });

    setChecked(newChecked);
    setIndeterminate(newIndeterminate);
  };

  const handleClose = () => {
    onClose();
    setChecked([]);
    setIndeterminate({});
  };

  return (
    <Dialog
      scroll="paper"
      {...dialogProps}
      onClose={(e, reason) => {
        if (reason !== 'backdropClick') handleClose();
      }}
      PaperProps={{
        sx: {
          maxWidth: 1000,
          width: 1,
        },
      }}
    >
      <DialogTitle>Lựa chọn quyền hạn</DialogTitle>
      <DialogContent>
        {permissionsLoading && (
          <Stack sx={{ width: 1, height: 200 }} alignItems="center" justifyContent="center">
            <CircularProgress size={8} />
          </Stack>
        )}

        <SimpleTreeView
          multiSelect
          expandedItems={expanded}
          onExpandedItemsChange={(event, nodes) => setExpanded(nodes)}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1,1fr)',
              sm: 'repeat(2,1fr)',
              md: 'repeat(3,1fr)',
            },
          }}
        >
          {permissions.map((permission) => (
            <TreeItem
              itemId={permission.id}
              key={permission.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={permission.permissions.every((p) => checked.includes(p.code))}
                    indeterminate={indeterminate[permission.id]}
                    onChange={() => handleToggle(permission.id)}
                    onClick={(event) => {
                      if (expanded.includes(permission.id)) event.stopPropagation();
                    }}
                  />
                  {permission.name}
                </Box>
              }
            >
              {permission.permissions.map((pg) => (
                <StyledTreeItem
                  itemId={pg.code}
                  key={pg.code}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        checked={checked.includes(pg.code)}
                        onChange={() => handleToggle(permission.id, pg.code)}
                      />
                      {pg.name}
                    </Box>
                  }
                />
              ))}
            </TreeItem>
          ))}
        </SimpleTreeView>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
        <Button
          variant="contained"
          onClick={() => {
            onSelectChange?.(checked);
            handleClose();
          }}
        >
          Lưu lựa chọn
        </Button>
      </DialogActions>
    </Dialog>
  );
}
