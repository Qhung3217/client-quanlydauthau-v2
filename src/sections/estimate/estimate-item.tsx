import type { CardProps } from '@mui/material';
import type { Project } from 'src/types/project';
import type { Estimate } from 'src/types/estimate';

import { usePopover } from 'minimal-shared/hooks';

import { Box, Card, Stack, MenuItem, MenuList, IconButton, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { getEstimateStatusLabel } from 'src/helpers/get-estimate-status-label';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import useEstimateActionPermit from './hooks/use-estimate-action-permit';

type Props = CardProps & {
  estimate: Estimate;
  project: Project;
  detailsClick?: (id: string) => void;
  editClick?: (id: string) => void;
  deleteClick?: (id: string) => void;
  approveClick?: (id: string) => void;
  rejectClick?: (id: string) => void;
  requestEditClick?: (id: string) => void;
};
export default function EstimateItem({
  estimate,
  project,
  detailsClick,
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
    updateEstimatePermit,
    rejectEstimatePermit,
    approveEstimatePermit,
    requestEditEstimatePermit,
  } = useEstimateActionPermit(estimate.status, project.status);

  const hasPermitAction =
    updateEstimatePermit ||
    approveEstimatePermit ||
    rejectEstimatePermit ||
    requestEditEstimatePermit;

  const hasAction = editClick || deleteClick || approveClick || rejectClick || requestEditClick;

  const labelConfig = getEstimateStatusLabel(estimate.status);

  const renderMenuActions = () =>
    hasAction &&
    hasPermitAction && (
      <CustomPopover
        open={menuActions.open}
        anchorEl={menuActions.anchorEl}
        onClose={menuActions.onClose}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuList>
          {approveEstimatePermit && approveClick && (
            <MenuItem
              onClick={() => {
                approveClick(estimate.id);
                menuActions.onClose();
              }}
            >
              <Iconify icon="mdi:approve" sx={{ color: 'success.main' }} />
              Duyệt dự toán
            </MenuItem>
          )}
          {rejectEstimatePermit && rejectClick && (
            <MenuItem
              onClick={() => {
                rejectClick(estimate.id);
                menuActions.onClose();
              }}
            >
              <Iconify icon="mdi:cancel-octagon-outline" />
              Hủy dự toán
            </MenuItem>
          )}

          {requestEditEstimatePermit && requestEditClick && (
            <MenuItem
              onClick={() => {
                requestEditClick(estimate.id);
                menuActions.onClose();
              }}
            >
              <Iconify icon="carbon:request-quote" sx={{ color: 'info.main' }} />
              Yêu cầu điều chỉnh
            </MenuItem>
          )}
          {/* {editPermit && editClick && (
            <MenuItem
              component={RouterLink}
              href={paths.project.edit(project.id)}
              onClick={() => menuActions.onClose()}
            >
              <Iconify icon="solar:pen-bold" />
              Cập nhật
            </MenuItem>
          )} */}
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
            p: 1,
            boxShadow: 'none',
            position: 'relative',
            '&:hover': {
              backgroundColor: 'background.neutral',
            },
            ...(detailsClick && {
              cursor: 'pointer',
            }),
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        onClick={() => detailsClick?.(estimate.id)}
        {...other}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Label variant="soft" color={labelConfig.color} {...labelConfig?.otherProps}>
              {labelConfig.label}
            </Label>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
            variant="h6"
            sx={[
              (theme) => ({
                ...theme.mixins.maxLine({ line: 2 }),
                color: 'primary.darker',
              }),
            ]}
          >
            {estimate.name}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1,1fr)',
                md: 'repeat(2,1fr)',
              },
            }}
          >
            <Stack spacing={1}>
              <Typography variant="caption" sx={{}}>
                <strong> Mã dự án:</strong> #{project.code}
              </Typography>

              <Typography variant="caption" sx={{}}>
                <strong> Dự án: </strong> {project.name}
              </Typography>

              <Typography variant="caption" sx={{}}>
                <strong> Ngày tạo: </strong> {fDate(estimate.createdAt)}
              </Typography>
            </Stack>
            <Stack spacing={1}>
              <Typography variant="caption" sx={{}}>
                <strong> Người tạo: </strong> {estimate.creator.name}{' '}
                {estimate.creator?.company?.name && `(${estimate.creator?.company?.name})`}
              </Typography>
              <Typography variant="caption" sx={{}}>
                <strong> Email: </strong> {estimate.creator.email}
              </Typography>
              <Typography variant="caption" sx={{}}>
                <strong> Số điện thoại: </strong> {estimate.creator.phone}
              </Typography>
            </Stack>
          </Box>
        </Box>

        {(editClick || deleteClick || approveClick || rejectClick) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              position: 'absolute',
              bottom: 4,
              right: 8,
              zIndex: 2,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {hasAction && hasPermitAction && (
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
