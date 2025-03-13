import LoadingButton from '@mui/lab/LoadingButton';

import { ConfirmDialog } from 'src/components/custom-dialog';

type Props = {
  open: boolean;
  onClose: () => void;
  count: number;
  onConfirm: () => void;
  confirming?: boolean;
  content?: any;
  title?: any;
};
export default function DeleteConfirmDialog({
  open,
  onClose,
  count,
  onConfirm,
  confirming,
  content,
  title,
}: Props) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={title || 'Xác nhận xóa'}
      content={
        content || (
          <>
            Bạn chắc chắn muốn xóa <strong> {count} </strong> dòng dữ liệu này? Lưu ý, thao tác này
            là <strong>không thể hoàn tác</strong>.
          </>
        )
      }
      action={
        <LoadingButton variant="contained" color="error" onClick={onConfirm} loading={confirming}>
          Xóa
        </LoadingButton>
      }
    />
  );
}
