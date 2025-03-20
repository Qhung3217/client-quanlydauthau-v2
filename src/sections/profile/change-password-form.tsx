import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { changePassword } from 'src/actions/profile';

// import { changeMyPassword } from 'src/actions/my-account';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import BlockField from 'src/components/hook-form/block-field';

// ----------------------------------------------------------------------

export type ChangePassWordSchemaType = zod.infer<typeof ChangePassWordSchema>;

export const ChangePassWordSchema = zod
  .object({
    oldPassword: zod
      .string()
      .min(1, { message: 'Mật khẩu là bắt buộc!' })
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự!' }),
    newPassword: zod
      .string()
      .min(1, { message: 'Mật khẩu mới là bắt buộc!' })
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự!' })
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
        'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt'
      ),
    confirmNewPassword: zod.string().min(1, { message: 'Nhập lại mật khẩu là bắt buộc!' }),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'Mật khẩu mới phải khác mật khẩu cũ!',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Mật khẩu khống giống nhau!',
    path: ['confirmNewPassword'],
  });

// ----------------------------------------------------------------------

export function ChangePasswordForm() {
  const showPassword = useBoolean();

  const defaultValues: ChangePassWordSchemaType = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm<ChangePassWordSchemaType>({
    mode: 'all',
    resolver: zodResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await changePassword(data.oldPassword, data.newPassword);
      toast.success('Đổi mật khẩu thành công!');
      reset();
      showPassword.onFalse();
    } catch (error: any) {
      console.error(error);
      switch (error?.statusCode) {
        case 409:
          setError('oldPassword', {
            message: 'Mật khẩu hiện tại không đúng!',
          });
          break;

        default:
          toast.error('Đã có lỗi xảy ra!');

          break;
      }
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card
        sx={{
          p: 3,
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <BlockField label="Mật khẩu hiện tại" required>
          <Field.Text
            name="oldPassword"
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
          />
        </BlockField>
        <BlockField label="Mật khẩu mới" required>
          <Field.Text
            name="newPassword"
            size="small"
            type={showPassword.value ? 'text' : 'password'}
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
              <Box component="span" sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                {/* <Iconify icon="eva:info-fill" width={16} /> */}
                <Box>
                  Mật khẩu phải có ít nhất <strong>6 ký tự</strong> <br />
                  Mật khẩu phải chứa ít nhất một <strong>chữ hoa</strong>, một{' '}
                  <strong>chữ thường</strong>, một <strong>số</strong> và một{' '}
                  <strong>ký tự đặc biệt</strong>
                </Box>
              </Box>
            }
          />
        </BlockField>
        <BlockField label="Nhập lại mật khẩu" required>
          <Field.Text
            name="confirmNewPassword"
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
          />
        </BlockField>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Đổi mật khẩu
        </LoadingButton>
      </Card>
    </Form>
  );
}
