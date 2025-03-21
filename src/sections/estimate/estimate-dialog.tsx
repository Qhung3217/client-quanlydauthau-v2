import {
  Alert,
  Stack,
  Button,
  Dialog,
  Divider,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetEstimate } from 'src/actions/estimate';
import { PERMISSION_ENUM } from 'src/constants/permission';

import { EmptyContent } from 'src/components/empty-content';

import { useCheckPermission } from 'src/auth/hooks';

import ProjectItem from '../project/project-item';
import EstimateAlertEdit from './estimate-alert-edit';
import ProductEstimatedList from './product-estimated-list';
import useEstimateActions from './hooks/use-estimate-actions';
import useEstimateActionPermit from './hooks/use-estimate-action-permit';

type Props = {
  open: boolean;
  onClose: () => void;
  estimateId: string;
};

export default function EstimateDialog({ open, onClose, estimateId }: Props) {
  const { estimate, estimateLoading, estimateEmpty } = useGetEstimate(estimateId);

  const { UPDATE_PERMIT } = useCheckPermission({
    UPDATE_PERMIT: PERMISSION_ENUM.UPDATE_ESTIMATE,
  });

  const { onApprove, onReject, onRequestEdit, renderConfirmDialog } = useEstimateActions();

  const {
    updateEstimatePermit,
    rejectEstimatePermit,
    approveEstimatePermit,
    requestEditEstimatePermit,
  } = useEstimateActionPermit(estimate?.status as any, estimate?.project?.status as any);

  const showRequestEditDialog = estimate?.status === 'EDIT_REQUESTED' && UPDATE_PERMIT;

  const isRequestEdit = estimate?.status === 'EDIT_REQUESTED';
  const isApproved = estimate?.status === 'APPROVED';
  const isCanceled = estimate?.status === 'CANCELED';

  const renderAlert = () => {
    if (isApproved)
      return (
        <Alert
          sx={{
            py: 0,
            '& > *': {
              py: 0.5,
            },
          }}
        >
          Dự toán đã được duyệt
        </Alert>
      );
    if (isCanceled)
      return (
        <Alert
          severity="error"
          sx={{
            py: 0,
            '& > *': {
              py: 0.5,
            },
          }}
        >
          Dự toán bị từ chối
        </Alert>
      );
    if (isRequestEdit)
      return (
        <Alert
          severity="warning"
          variant="filled"
          sx={{
            py: 0,
            '& > *': {
              py: 0.5,
            },
          }}
        >
          Dự toán được yêu cầu điều chỉnh
        </Alert>
      );
    return (
      <Alert
        severity="warning"
        sx={{
          py: 0,
          '& > *': {
            py: 0.5,
          },
        }}
      >
        Dự toán đang chờ duyệt
      </Alert>
    );
  };
  const renderLoading = () => (
    <Stack direction="column" alignItems="center" justifyContent="center" sx={{ height: 100 }}>
      <CircularProgress size={70} />
    </Stack>
  );
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: 'md',
          width: 1,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        Xem dự toán: {estimate?.name}
        {estimate && renderAlert()}
      </DialogTitle>
      <DialogContent>
        {estimateLoading && renderLoading()}
        {estimateEmpty && <EmptyContent title="Không tìm thấy dự toán" />}
        {!estimateEmpty && !estimateLoading && (
          <Stack direction="column" spacing={2}>
            <ProjectItem
              project={{
                ...estimate!.project,
                estimators: [],
                _count: {
                  estimates: 1,
                },
              }}
            />

            <ProductEstimatedList productEsts={estimate?.productEstimates || []} />
          </Stack>
        )}

        {showRequestEditDialog && <EstimateAlertEdit id={estimate.id} />}

        {renderConfirmDialog()}
      </DialogContent>
      <DialogActions>
        {estimate && (
          <>
            {updateEstimatePermit && (
              <>
                <Button
                  LinkComponent={RouterLink}
                  href={paths.estimate.edit(estimate.id)}
                  variant="contained"
                  color="warning"
                >
                  Điều chỉnh
                </Button>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 1, borderColor: 'primary.dark' }}
                />
              </>
            )}

            {approveEstimatePermit && (
              <Button
                color="primary"
                variant="contained"
                onClick={() => onApprove({ id: estimate?.id, name: estimate?.name })}
              >
                Duyệt dự toán
              </Button>
            )}
            {requestEditEstimatePermit && (
              <Button
                color="warning"
                variant="contained"
                onClick={() => onRequestEdit({ id: estimate?.id, name: estimate?.name })}
              >
                Yêu cầu điều chỉnh
              </Button>
            )}
            {rejectEstimatePermit && (
              <Button
                color="error"
                variant="contained"
                onClick={() => onReject({ id: estimate?.id, name: estimate?.name })}
              >
                Hủy dự toán
              </Button>
            )}
          </>
        )}
        <Button onClick={onClose} variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
