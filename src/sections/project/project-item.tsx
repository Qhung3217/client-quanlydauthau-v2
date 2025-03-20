import type { CardProps } from '@mui/material';
import type { Project } from 'src/types/project';

import { usePopover } from 'minimal-shared/hooks';

import { Box, Card, Link, Stack, MenuItem, MenuList, IconButton, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { getProjectStatusConfig } from 'src/helpers/get-project-status-label';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import PriorityTag from '../priority/priority-tag';
import useProjectActionPermit from './hooks/use-project-action-permit';

type Props = CardProps & {
  project: Project;
  editClick?: (id: string) => void;
  deleteClick?: (id: string) => void;
  approveClick?: (id: string) => void;
  rejectClick?: (id: string) => void;
  requestEditClick?: (id: string) => void;
  itemNotLink?: boolean;
};
export default function ProjectItem({
  project,
  itemNotLink,
  deleteClick,
  editClick,
  approveClick,
  rejectClick,
  requestEditClick,
  sx,
  ...other
}: Props) {
  const menuActions = usePopover();

  const {
    editPermit,
    deletePermit,
    approvePermit,
    rejectPermit,
    requestEditPermit,
    createEstimatePermit,
    viewEstimatePermit,
  } = useProjectActionPermit(project.status);

  const labelConfig = getProjectStatusConfig(project.status);

  const isEstimated = project._count.estimates > 0;

  const renderMenuActions = () =>
    (editClick || deleteClick || approveClick || rejectClick) &&
    (editPermit || deletePermit || approvePermit || rejectPermit || viewEstimatePermit) && (
      <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuList>
          {approvePermit && approveClick && (
            <MenuItem
              onClick={() => {
                approveClick(project.id);
                menuActions.onClose();
              }}
            >
              <Iconify icon="mdi:approve" sx={{ color: 'success.main' }} />
              Duyệt dự án
            </MenuItem>
          )}
          {rejectPermit && rejectClick && (
            <MenuItem
              onClick={() => {
                rejectClick(project.id);
                menuActions.onClose();
              }}
            >
              <Iconify icon="mdi:cancel-octagon-outline" />
              Hủy dự án
            </MenuItem>
          )}
          {!isEstimated && createEstimatePermit && (
            <MenuItem
              onClick={() => {
                menuActions.onClose();
              }}
              component={RouterLink}
              href={paths.project.estimate(project.id)}
            >
              <Iconify icon="mdi:paper-edit-outline" sx={{ color: 'info.darker' }} />
              Nhập dự toán
            </MenuItem>
          )}
          {isEstimated && viewEstimatePermit && (
            <MenuItem
              onClick={() => {
                menuActions.onClose();
              }}
              component={RouterLink}
              href={paths.project.view_estimate(project.id)}
            >
              <Iconify icon="mage:file-3" sx={{ color: 'info' }} />
              Xem dự toán
            </MenuItem>
          )}
          {requestEditPermit && requestEditClick && (
            <MenuItem
              onClick={() => {
                requestEditClick(project.id);
                menuActions.onClose();
              }}
            >
              <Iconify icon="carbon:request-quote" sx={{ color: 'info.main' }} />
              Yêu cầu điều chỉnh
            </MenuItem>
          )}
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
      <Card
        sx={[
          {
            borderRadius: 1,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            p: 2,
            boxShadow: 'none',
            position: 'relative',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {!!project?.priority && <PriorityTag priority={project.priority} showText />}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
            #{project.code}
          </Box>
          <Box>
            <Label variant="soft" color={labelConfig.color} {...labelConfig?.otherProps}>
              {labelConfig.label}
            </Label>
          </Box>
        </Box>

        <Box sx={{ mb: 1 }}>
          {itemNotLink ? (
            <Typography
              variant="h6"
              sx={[
                (theme) => ({
                  ...theme.mixins.maxLine({ line: 2 }),
                  color: 'primary.main',
                }),
              ]}
            >
              {project.name}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              href={paths.project.details(project.id)}
              variant="h6"
              sx={[
                (theme) => ({
                  ...theme.mixins.maxLine({ line: 2 }),
                  color: 'primary.darker',
                  width: 'fit-content',
                }),
              ]}
            >
              {project.name}
            </Link>
          )}
        </Box>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          sx={{
            maxWidth: {
              xs: 1,
              md: 800,
            },
          }}
        >
          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Bên mời thầu:</strong> {project.inviter.name}
            </Typography>
            <Typography variant="body2">
              <strong>Chủ đầu tư:</strong> {project.investor.name}
            </Typography>
            <Typography variant="body2">
              <strong>Ngày đăng tải:</strong> {fDate(project.createdAt)}
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Địa điểm:</strong> {project.address}
            </Typography>
            {/* <Typography variant="body2">
              <strong>Thời điểm đóng thầu:</strong> {fDate(project.estDeadline)}
            </Typography> */}
            <Typography variant="body2">
              <strong>Hạn đóng dự toán:</strong> {fDate(project.estDeadline)}
            </Typography>
          </Stack>
        </Stack>
        {(editClick || deleteClick || approveClick || rejectClick) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              position: 'absolute',
              bottom: 4,
              right: 8,
            }}
          >
            {(editClick || deleteClick || approveClick || rejectClick) &&
              (editPermit ||
                deletePermit ||
                approvePermit ||
                rejectPermit ||
                createEstimatePermit) && (
                <IconButton
                  color={menuActions.open ? 'inherit' : 'default'}
                  onClick={menuActions.onOpen}
                  size="small"
                >
                  <Iconify icon="eva:more-horizontal-fill" />
                </IconButton>
              )}
          </Box>
        )}
      </Card>

      {renderMenuActions()}
    </>
  );
}
