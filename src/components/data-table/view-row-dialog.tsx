import type { DialogProps } from '@mui/material';

import {
  Paper,
  Table,
  Button,
  Dialog,
  styled,
  TableRow,
  TableBody,
  TableCell,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
  tableCellClasses,
} from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.root}[scope="row"]`]: {
    fontWeight: 'bold',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

type Props = Omit<DialogProps, 'children' | 'onClose'> & {
  dialogTitle?: string;
  onClose: () => void;
  data: {
    label: string;
    value: string;
  }[];
};
export default function ViewRowDialog({ dialogTitle, data, ...dialogProps }: Props) {
  return (
    <Dialog
      {...dialogProps}
      scroll="paper"
      PaperProps={{
        sx: {
          maxWidth: 'md',
          width: 1,
        },
      }}
    >
      <DialogTitle>{dialogTitle || 'Xem chi tiết'}</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableBody>
              {data.map((row) => (
                <StyledTableRow key={row.label}>
                  <StyledTableCell component="th" scope="row">
                    {row.label}
                  </StyledTableCell>
                  <StyledTableCell>{row.value}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialogProps.onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
