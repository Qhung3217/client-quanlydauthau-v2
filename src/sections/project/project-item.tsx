import type { CardProps } from '@mui/material';
import type { Project } from 'src/types/project';

import { usePopover } from 'minimal-shared/hooks';

import { Box, Card, Link, Stack, MenuItem, MenuList, IconButton, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { PERMISSION_ENUM } from 'src/constants/permission';
import { getProjectStatusConfig } from 'src/helpers/get-project-status-label';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { useCheckPermission } from 'src/auth/hooks';

type Props = CardProps & {
  project: Project;
  detailsClick?: (project: Project) => void;
  editClick?: (id: string) => void;
  deleteClick?: (id: string) => void;
  itemNotLink?: boolean;
};
export default function ProjectItem({
  project,
  itemNotLink,
  deleteClick,
  detailsClick,
  editClick,
  sx,
  ...other
}: Props) {
  const menuActions = usePopover();

  const { DELETE_PERMIT, EDIT_PERMIT } = useCheckPermission({
    EDIT_PERMIT: PERMISSION_ENUM.UPDATE_PROJECT,
    DELETE_PERMIT: PERMISSION_ENUM.DELETE_PROJECT,
  });

  const labelConfig = getProjectStatusConfig(project.status);

  const editPermit = EDIT_PERMIT && project.status === 'EDIT_REQUESTED';

  const deletePermit = DELETE_PERMIT && project.status === 'PENDING';

  const renderMenuActions = () =>
    (editClick || deleteClick) &&
    (editPermit || deletePermit) && (
      <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuList>
          {editPermit && editClick && (
            <MenuItem
              component={RouterLink}
              href={paths.project.edit(project.id)}
              onClick={() => menuActions.onClose()}
            >
              <Iconify icon="solar:pen-bold" />
              Cập nhật
            </MenuItem>
          )}

          {deletePermit && deleteClick && (
            <MenuItem
              onClick={() => {
                console.log(project.id);
                deleteClick(project.id);

                menuActions.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Xóa
            </MenuItem>
          )}
        </MenuList>
      </CustomPopover>
    );

  return (
    <>
      <Card sx={[{ display: 'flex' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
        <Stack
          spacing={1}
          sx={[
            (theme) => ({
              flexGrow: 1,
              p: theme.spacing(3, 3, 2, 3),
              position: 'relative',
            }),
          ]}
        >
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Label variant="soft" color={labelConfig.color} {...labelConfig?.otherProps}>
                {labelConfig.label}
              </Label>
              {editPermit && (
                <Label color="warning" variant="filled" sx={{ ml: 1 }}>
                  Yêu cầu điều chỉnh
                </Label>
              )}
            </Box>
            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(project.updatedAt)}
            </Box>
          </Box>

          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            {itemNotLink ? (
              <Typography
                variant="subtitle2"
                sx={[
                  (theme) => ({
                    ...theme.mixins.maxLine({ line: 2 }),
                    color: 'primary.main',
                  }),
                ]}
              >
                #{project.code} - {project.name}
              </Typography>
            ) : (
              <Link
                component={RouterLink}
                href="." // CHUA GẮN Link
                variant="subtitle2"
                sx={[
                  (theme) => ({
                    ...theme.mixins.maxLine({ line: 2 }),
                  }),
                ]}
              >
                #{project.code} - {project.name}
              </Link>
            )}
          </Stack>
          {(detailsClick || editClick || deleteClick) && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                position: 'absolute',
                bottom: 8,
                right: 8,
              }}
            >
              {detailsClick && (
                <IconButton
                  onClick={() => {
                    detailsClick(project);
                    menuActions.onClose();
                  }}
                  color="info"
                >
                  <Iconify icon="mdi:eye" />
                </IconButton>
              )}
              {(editClick || deleteClick) && (editPermit || deletePermit) && (
                <IconButton
                  color={menuActions.open ? 'inherit' : 'default'}
                  onClick={menuActions.onOpen}
                >
                  <Iconify icon="eva:more-horizontal-fill" />
                </IconButton>
              )}
            </Box>
          )}
        </Stack>
      </Card>

      {renderMenuActions()}
    </>
  );
}
