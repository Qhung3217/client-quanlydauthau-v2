import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

type Props = {
  id: string;
};
export default function EstimateAlertEdit({ id }: Props) {
  return (
    <Dialog
      open
      PaperProps={{
        sx: {
          maxWidth: 400,
          width: 1,
        },
      }}
    >
      <DialogTitle>Dự toán này được yêu cầu điều chỉnh</DialogTitle>
      <DialogContent>
        <DialogContentText>Hãy điều chỉnh dự toán này để tiếp tục</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          LinkComponent={RouterLink}
          href={paths.estimate.edit(id)}
          variant="contained"
          color="warning"
        >
          Điều chỉnh
        </Button>
      </DialogActions>
    </Dialog>
  );
}
