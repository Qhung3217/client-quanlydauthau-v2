import type { DialogProps } from '@mui/material';

import { toast } from 'sonner';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Dialog,
  Button,
  Divider,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';

import { resetPassword } from 'src/actions/user-ssr';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import BlockField from 'src/components/hook-form/block-field';

// ----------------------------------------------------------------------

export type ResetPasswordSchemaType = zod.infer<typeof ResetPasswordSchema>;

export const ResetPasswordSchema = zod.object({
  password: zod
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự!')
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt'
    ),
});

// ----------------------------------------------------------------------
type Props = Omit<DialogProps, 'children' | 'onClose'> & {
  accountId?: string;
  username?: string;
  onClose: () => void;
};
export default function UserResetPasswordDialog({
  accountId,
  username,
  onClose,
  ...dialogProps
}: Props) {
  const showPassword = useBoolean();
  const defaultValues: ResetPasswordSchemaType = {
    password: '',
  };

  const methods = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await resetPassword(accountId as string, data.password);

      toast.success('Đặt lại mật khẩu thành công !');

      handleClose();
    } catch (error: any) {
      console.error(error);
      toast.error('Đã có lỗi xảy ra!');
    }
  });

  const handleClose = () => {
    onClose();
    reset();
  };
  return (
    <Dialog
      PaperProps={{
        sx: {
          width: 1,
          maxWidth: 600,
        },
      }}
      {...dialogProps}
      onClose={handleClose}
    >
      <DialogTitle>Đặt lại mật khẩu</DialogTitle>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Typography gutterBottom>
            Đặt lại mật khẩu cho tài khoản <strong>{username}</strong>
          </Typography>
          <Divider sx={{ mt: 2, mb: 3, borderStyle: 'dashed' }} />
          <BlockField label="Đặt lại mật khẩu" required>
            <Field.Text
              name="password"
              type={showPassword.value ? 'text' : 'password'}
              size="small"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={showPassword.onToggle} edge="end">
                        <Iconify
                          icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              helperText={
                <>
                  Mật khẩu phải chứa ít nhất một <strong>chữ hoa</strong>, một{' '}
                  <strong>chữ thường</strong>, một <strong>số</strong> và một{' '}
                  <strong>ký tự đặc biệt</strong>
                </>
              }
            />
          </BlockField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}> Đóng</Button>
          <LoadingButton loading={isSubmitting} variant="contained" type="submit">
            Đặt lại mật khẩu
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
