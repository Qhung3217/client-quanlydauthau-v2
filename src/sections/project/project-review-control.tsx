import type { Project } from 'src/types/project';

import { toast } from 'sonner';
import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import LoadingButton from '@mui/lab/LoadingButton';
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
        subtitle: 'Sau khi duyệt, dự án sẽ bắt đầu được nhận dự toán.',
      };
    case 'CANCELED':
      return {
        message: 'Bạn có chắc chắn muốn hủy dự án này?',
        subtitle: 'Sau khi hủy dự án sẽ không thể cập nhật lại trạng thái dự án.',
      };
    case 'EDIT_REQUESTED':
      return {
        message: 'Bạn có chắc chắn muốn Yêu cầu điều chỉnh dự án này?',
        subtitle:
          'Sau khi xác nhận, dự án có thể được điều chỉnh.',
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

  const processing = useBoolean();

  const { approvePermit, rejectPermit, requestEditPermit } = useProjectActionPermit(project.status);

  const projectStatusRender = () => (
    <Box>
      <Stepper
        activeStep={PUBLIC_PROJECT_STATUS.indexOf(project.status)}
        alternativeLabel
      >
        {PUBLIC_PROJECT_STATUS.map((status) => {
          const config = getProjectStatusConfig(status);
          return (
            <Step key={status}>
              <Tooltip
                title={config.desc}
              >
                <StepLabel>
                  {config.label}
                </StepLabel>
              </Tooltip>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );

  const handleConfirmAction = async () => {
    try {
      processing.onTrue()
      switch (selectedAction) {
        case 'APPROVED':
          await approveProject(project.id);
          toast.success('Cập nhật thành công');
          break;
        case 'CANCELED':
          await rejectProject(project.id);
          toast.success('Cập nhật thành công');
          break;
        case 'EDIT_REQUESTED':
          await requestEditProject(project.id);
          toast.success('Cập nhật thành công');
          break;
        default:
          toast.error('Đã có lỗi xảy ra.');
          break;
      }

      openDialogConfirm.onFalse();
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    } finally {
      processing.onFalse();
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
          {requestEditPermit && (
            <Button
              variant="contained"
              color="warning"
              sx={{ color: 'white' }}
              startIcon={
                <Iconify icon="material-symbols:edit-outline-sharp" width={24} color="white" />
              }
              onClick={() =>
                handleAction('EDIT_REQUESTED')
              }
            >
              Yêu cầu điều chỉnh
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
          <LoadingButton loading={processing.value} variant="contained" onClick={handleConfirmAction}>
            Xác nhận
          </LoadingButton>
        }
      />
    </Paper>
  );
}
