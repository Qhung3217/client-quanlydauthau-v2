import type { DialogProps } from '@mui/material';
import type { Project } from 'src/types/project';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  List,
  Table,
  Stack,
  Button,
  Dialog,
  styled,
  Avatar,
  TableRow,
  ListItem,
  TableBody,
  TableCell,
  Typography,
  DialogTitle,
  ButtonGroup,
  ListItemText,
  DialogActions,
  DialogContent,
  TableContainer,
  ListItemAvatar,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { attachServerUrl } from 'src/utils/attach-server-url';

import PriorityTag from '../priority/priority-tag';
import useProjectActions from './hooks/use-project-actions';
import useProjectActionPermit from './hooks/use-project-action-permit';

const StyledTableRow = styled(TableRow)(() => ({
  backgroundColor: '#fdfdfd',
}));
const StyledTableHeaderCell = styled(TableCell)(() => ({
  fontWeight: 'bold',
  backgroundColor: '#f7f8ff',
  width: '20%',
}));

type Props = Omit<DialogProps, 'children' | 'onClose'> & {
  onClose: () => void;
  project?: Project;
};

export default function ProjectPreviewDialog({ project, ...dialogProps }: Props) {
  const { approvePermit, rejectPermit, requestEditPermit } = useProjectActionPermit(
    project?.status || ''
  );

  const { onApprove, onReject, onRequestEdit, isProcessing, renderConfirmDialog } =
    useProjectActions();

  return (
    <Dialog
      PaperProps={{
        sx: {
          maxWidth: 'md',
          width: 1,
          position: 'relative',
        },
      }}
      {...dialogProps}
    >
      <DialogTitle>
        {!!project?.priority && <PriorityTag priority={project.priority} showText />}

        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center">
          <Typography sx={{ mr: 'auto' }} variant="inherit">
            Xem nhanh dự án
          </Typography>
          <ButtonGroup variant="outlined">
            {requestEditPermit && (
              <LoadingButton
                loading={isProcessing}
                onClick={() => onRequestEdit(project)}
                variant="soft"
                color="info"
              >
                Y/c điều chỉnh
              </LoadingButton>
            )}
            {rejectPermit && (
              <LoadingButton
                loading={isProcessing}
                onClick={() => onReject(project)}
                variant="soft"
                color="warning"
              >
                Từ chối dự án
              </LoadingButton>
            )}
            {approvePermit && (
              <LoadingButton
                loading={isProcessing}
                onClick={() => onApprove(project)}
                variant="soft"
                color="primary"
              >
                Duyệt dự án
              </LoadingButton>
            )}
          </ButtonGroup>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <TableContainer
          //   component={Paper}
          sx={{
            width: '100%',
            borderRadius: 0.5,
          }}
        >
          <Table sx={{ minWidth: 300, borderCollapse: 'collapse' }} aria-label="simple table">
            <TableBody>
              <StyledTableRow>
                <StyledTableHeaderCell>Mã dự án</StyledTableHeaderCell>
                <TableCell align="left">#{project?.code}</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableHeaderCell>Tên dự án</StyledTableHeaderCell>
                <TableCell align="left">{project?.name}</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableHeaderCell>Bên mời thầu</StyledTableHeaderCell>
                <TableCell align="left">{project?.inviter.name || 'Không có'}</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableHeaderCell>Chủ đầu tư</StyledTableHeaderCell>
                <TableCell align="left">{project?.investor.name || 'Không có'}</TableCell>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableHeaderCell>Địa chỉ</StyledTableHeaderCell>
                <TableCell align="left">{project?.address || 'Không có'}</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableHeaderCell>Ngày đăng tải thông báo</StyledTableHeaderCell>
                <TableCell align="left">{fDate(project?.createdAt, 'DD/MM/YYYY')}</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableHeaderCell>Thời điểm đóng thầu</StyledTableHeaderCell>
                <TableCell align="left">{fDate(project?.estDeadline)}</TableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableHeaderCell>Tham gia dự toán</StyledTableHeaderCell>
                <TableCell align="left">
                  <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {project?.estimators.map((estimator) => (
                      <ListItem key={estimator.id} disablePadding>
                        <ListItemAvatar>
                          <Avatar
                            alt={estimator.name}
                            src={attachServerUrl(estimator.avatar)}
                            sx={{ width: 28, height: 28 }}
                          />
                        </ListItemAvatar>
                        <ListItemText primary={estimator.name} />
                      </ListItem>
                    ))}
                  </List>
                </TableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {renderConfirmDialog()}
      </DialogContent>

      <DialogActions>
        <Button onClick={dialogProps.onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
