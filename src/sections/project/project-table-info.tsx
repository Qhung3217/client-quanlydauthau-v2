import type { Project } from 'src/types/project';

import {
  Box,
  List,
  Table,
  styled,
  Avatar,
  TableRow,
  ListItem,
  TableBody,
  TableCell,
  ListItemText,
  TableContainer,
  ListItemAvatar,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { attachServerUrl } from 'src/utils/attach-server-url';

import { PERMISSION_ENUM } from 'src/constants/permission';
import { getProjectStatusConfig } from 'src/helpers/get-project-status-label';

import { Label } from 'src/components/label';

import { useCheckPermission } from 'src/auth/hooks';

const StyledTableRow = styled(TableRow)(() => ({
  backgroundColor: '#fdfdfd',
}));
const StyledTableHeaderCell = styled(TableCell)(() => ({
  fontWeight: 'bold',
  backgroundColor: '#f7f8ff',
  width: '20%',
}));

type Props = {
  project: Project;
};

export default function ProjectTableInfo({ project }: Props) {
  const { APPROVE_PERMIT, REJECT_PERMIT } = useCheckPermission({
    APPROVE_PERMIT: PERMISSION_ENUM.APPROVE_PROJECT,
    REJECT_PERMIT: PERMISSION_ENUM.CANCEL_PROJECT,
  });

  const labelConfig = getProjectStatusConfig(project.status);

  const isShowEstimator = APPROVE_PERMIT || REJECT_PERMIT;

  return (
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
            <StyledTableHeaderCell>Trạng thái dự án</StyledTableHeaderCell>
            <TableCell align="left">
              <Box>
                <Label variant="soft" color={labelConfig.color} {...labelConfig?.otherProps}>
                  {labelConfig.label}
                </Label>
              </Box>
            </TableCell>
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
            <StyledTableHeaderCell>Ngày đăng tải</StyledTableHeaderCell>
            <TableCell align="left">{fDate(project?.createdAt, 'DD/MM/YYYY')}</TableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableHeaderCell>Hạn đóng dự toán</StyledTableHeaderCell>
            <TableCell align="left">{fDate(project?.estDeadline)}</TableCell>
          </StyledTableRow>
          {isShowEstimator && (
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
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
