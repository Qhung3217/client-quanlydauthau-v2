import type { Project } from 'src/types/project';

import { toast } from 'sonner';
import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Box, Step, Paper, Button, Stepper, Tooltip, StepLabel, Typography } from '@mui/material';

import { PUBLIC_PROJECT_STATUS } from 'src/constants/project';
import { getProjectStatusConfig } from 'src/helpers/get-project-status-label';
import { rejectProject, approveProject, requestEditProject } from 'src/actions/project-ssr';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import useProjectActionPermit from './hooks/use-project-action-permit';

const getDialogContent = (action: string) => {
  switch (action) {
    case 'APPROVED':
      return {
        message: 'Bạn có chắc chắn muốn duyệt dự án này?',
        subtitle: 'Dự án sẽ được công khai và nhận báo giá.',
      };
    case 'CANCELED':
      return {
        message: 'Bạn có chắc chắn muốn hủy dự án này?',
        subtitle: 'Sau khi hủy dự án sẽ không thể cập nhật lại trạng thái dự án.',
      };
    case 'REQUESTED_EDIT':
      return {
        message: 'Bạn có chắc chắn muốn bật yêu cầu chỉnh sửa dự án này?',
        subtitle:
          'Sau khi bật yêu cầu chỉnh sửa, dự án có thể được điều chỉnh khi ở trạng thái chờ duyệt và báo giá có thể được điều chỉnh.',
      };
    case 'CANCEL_REQUESTED_EDIT':
      return {
        message: 'Bạn có chắc chắn muốn tắt yêu cầu chỉnh sửa dự án này?',
        subtitle: 'Sau khi tắt yêu cầu chỉnh sửa chủ dự án sẽ không thể cập nhật dự án.',
      };
    case 'COMPLETED':
      return {
        message: 'Bạn có chắc chắn muốn duyệt hoàn thành dự án này?',
        subtitle: 'Sau khi duyệt hoàn thành sẽ không thể cập nhật lại trạng thái dự án.',
      };
    default:
      return { message: '', subtitle: '' };
  }
};

type Props = {
  project: Project;
};
export default function ProjectReviewControl({ project }: Props) {
  const [selectedAction, setSelectedAction] = useState<string>('');

  const { message, subtitle } = getDialogContent(selectedAction);

  const openDialogConfirm = useBoolean();

  const { approvePermit, rejectPermit, requestEditPermit } = useProjectActionPermit(project.status);

  const projectStatusRender = () => (
    <Box>
      <Stepper
        activeStep={PUBLIC_PROJECT_STATUS.indexOf(project.status)}
        alternativeLabel
        // orientation="vertical"
      >
        {PUBLIC_PROJECT_STATUS.map((status) => {
          const config = getProjectStatusConfig(status);
          const isActive = project.status === status;
          return (
            <Step key={status}>
              <Tooltip
                title={
                  project.status === 'EDIT_REQUESTED' && isActive
                    ? `${config.desc} đang đợi điều chỉnh`
                    : config.desc
                }
              >
                <StepLabel
                  sx={{
                    '& .MuiStepIcon-root': {
                      color:
                        project.status === 'EDIT_REQUESTED' && isActive
                          ? 'warning.main'
                          : 'success',
                    },
                    '& .MuiStepLabel-label': {
                      color:
                        project.status === 'EDIT_REQUESTED' && isActive
                          ? 'warning.main'
                          : 'success',
                    },
                  }}
                >
                  {config.label}
                </StepLabel>
              </Tooltip>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );

  const handleConfirmAction = () => {
    try {
      if (selectedAction === 'APPROVED') approveProject(project.id);

      if (selectedAction === 'CANCELED') rejectProject(project.id);

      // if (selectedAction === 'COMPLETED') completeProject(project.id);

      if (selectedAction === 'EDIT_REQUESTED') requestEditProject(project.id);

      toast.success('Cập nhật thành công');
      openDialogConfirm.onFalse();
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleAction = (action: string) => {
    setSelectedAction(action);
    openDialogConfirm.onTrue();
  };
  return (
    <Paper
      sx={{
        flex: 1,
        p: 2,
        mb: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: { xs: 'static', md: 'absolute' },
          top: { xs: 'auto', md: 0 },
          left: { xs: 'auto', md: 0 },
          p: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* <Typography variant="h5">Trạng thái dự án</Typography> */}
        {project.status === 'EDIT_REQUESTED' && (
          <Label sx={{ ml: 1 }} color="warning" variant="filled">
            Yêu cầu điều chỉnh
          </Label>
        )}
      </Box>
      <Box display="flex" alignItems="center" flexDirection="column">
        {projectStatusRender()}
        {(requestEditPermit || approvePermit || rejectPermit) && (
          <Box mt={2}>
            <Typography variant="subtitle1" align="center" color="text.secondary">
              Các thao tác
            </Typography>
          </Box>
        )}
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mt={2}>
          {approvePermit && (
            <Button
              variant="contained"
              color="success"
              startIcon={<Iconify icon="material-symbols:bookmark-check-outline" width={24} />}
              onClick={() => handleAction('APPROVED')}
            >
              Duyệt dự án
            </Button>
          )}
          {/* {APPROVE_PERMIT && project.status === 'APPROVED' && (
             <Button
               variant="contained"
               color="inherit"
               startIcon={<Iconify icon="material-symbols:group-outline-rounded" width={24} />}
               onClick={showApproveForm.onTrue}
             >
               Hạn chế đấu thầu
             </Button>
           )} */}

          {/* {ADMIN_VIEW_QUOTATION_PERMIT && (
             <Button
               variant="contained"
               color="info"
               sx={{ color: 'white' }}
               startIcon={
                 <Iconify
                   icon="material-symbols:list-alt-outline-rounded"
                   width={24}
                   color="white"
                 />
               }
               onClick={toggleQuotationsDrawer(true)}
             >
               Xem danh sách báo giá
             </Button>
           )} */}

          {requestEditPermit && (
            <Button
              variant="contained"
              color="warning"
              sx={{ color: 'white' }}
              startIcon={
                project.status === 'EDIT_REQUESTED' ? (
                  <Iconify icon="material-symbols:edit-off-sharp" width={24} color="white" />
                ) : (
                  <Iconify icon="material-symbols:edit-outline-sharp" color="white" width={24} />
                )
              }
              onClick={() =>
                handleAction(
                  project.status === 'EDIT_REQUESTED' ? 'CANCEL_REQUESTED_EDIT' : 'REQUESTED_EDIT'
                )
              }
            >
              {project.status === 'EDIT_REQUESTED'
                ? 'Tắt yêu cầu điều chỉnh'
                : 'Bật yêu cầu điều chỉnh'}
            </Button>
          )}

          {/* {COMPLETE_PERMIT && ['QUOTED'].includes(project.status) && !project.isEditable && (
             <Button
               variant="contained"
               color="success"
               startIcon={<Iconify icon="material-symbols:done-all" width={24} />}
               onClick={() => handleAction('COMPLETED')}
             >
               Duyệt hoàn thành
             </Button>
           )} */}

          {rejectPermit && (
            <Button
              variant="contained"
              color="error"
              startIcon={<Iconify icon="material-symbols:cancel" width={24} />}
              onClick={() => handleAction('CANCELED')}
            >
              Hủy dự án
            </Button>
          )}

          {project.status === 'CANCELED' && (
            <Typography variant="h6" color="error" align="center">
              Dự án này đã bị hủy không thể thao tác!
            </Typography>
          )}
          {project.status === 'COMPLETED' && (
            <Typography variant="h6" color="info" align="center">
              Dự án này đã hoàn thành không thể thao tác!
            </Typography>
          )}
        </Box>
      </Box>

      <ConfirmDialog
        open={openDialogConfirm.value}
        onClose={openDialogConfirm.onFalse}
        title="Xác nhận thực hiện"
        content={
          <>
            <Typography variant="body1">{message}</Typography>
            <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
              {subtitle}
            </Typography>
          </>
        }
        action={
          <Button variant="contained" onClick={handleConfirmAction}>
            Xác nhận
          </Button>
        }
      />
    </Paper>
  );
}
