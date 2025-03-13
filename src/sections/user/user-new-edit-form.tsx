'use client';

import type { User } from 'src/types/user';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetRoles } from 'src/actions/role';
import { uploadSingleFile } from 'src/actions/media';
import { USER_STATUS_OBJ } from 'src/constants/user';
import { useGetCompanies } from 'src/actions/company';
import { createUser, updateUser } from 'src/actions/user-ssr';

import { toast } from 'src/components/snackbar';
import BlockField from 'src/components/hook-form/block-field';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  name: zod.string().min(1, 'Tên người dùng là bắt buộc!'),
  username: zod.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  password: zod
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự!')
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt'
    ),
  roleId: zod.string().min(1, 'Quyền hạn là bắt buộc!'),
  companyId: zod.string().min(1, 'Công ty là bắt buộc!'),
  status: zod.boolean(),
  birthDate: zod
    .string()
    .refine(
      (date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate) && new Date(parsedDate) < new Date();
      },
      {
        message: 'Ngày sinh không hợp lệ',
      }
    )
    .optional(),
  email: zod.string().email('Email không hợp lệ'),
  phone: zod
    .string()
    .min(1, { message: 'Số điện thoại là bắt buộc!' })
    .refine(
      (value) => value.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
      'Số điện thoại không hợp lệ!'
    ),
  avatar: schemaHelper.file({ required: false }),
  address: zod.string().optional(),
});

export const EditUserSchema = NewUserSchema.omit({
  password: true,
});
// ----------------------------------------------------------------------

type Props = {
  currentRecord?: User;
  loading?: boolean;
};

export function UserNewEditForm({ currentRecord, loading }: Props) {
  const router = useRouter();

  const checkingCode = useBoolean();

  const { roles } = useGetRoles({
    perPage: Number.MAX_SAFE_INTEGER,
  });

  const { companies } = useGetCompanies({
    perPage: Number.MAX_SAFE_INTEGER,
  });

  const isEdit = !!currentRecord;

  const recordFormData = useMemo(() => {
    if (!isEdit) return undefined;
    return {
      ...currentRecord,
      roleId: currentRecord.role?.id || '',
      companyId: currentRecord.company.id,
      password: '',
      avatar: currentRecord.avatar,
      status: currentRecord.status === USER_STATUS_OBJ.ACTIVE,
    };
  }, [currentRecord, isEdit]);

  const defaultValues: NewUserSchemaType = {
    name: '',
    username: '',
    password: '',
    roleId: '',
    companyId: '',
    birthDate: '',
    email: '',
    phone: '',
    avatar: '',
    address: '',
    status: true,
  };

  const methods = useForm<NewUserSchemaType>({
    resolver: zodResolver(
      isEdit
        ? NewUserSchema.omit({
            password: true,
          })
        : NewUserSchema
    ),
    defaultValues,
    values: recordFormData,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, dirtyFields },
    setError,
    setValue,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!isEdit) {
        const { avatar, ...info } = data;
        if (avatar && avatar instanceof File) {
          const avatarUrl = await uploadSingleFile(avatar);
          await createUser({
            ...info,
            avatar: avatarUrl.path,
          });
        } else {
          await createUser(info);
        }

        toast.success('Thêm thành công !');
      } else {
        const { avatar, ...info } = data;

        if (dirtyFields.avatar) {
          if (avatar) {
            const avatarUrl = await uploadSingleFile(avatar as File);
            await updateUser(currentRecord.id, { ...info, avatar: avatarUrl.path });
          } else {
            await updateUser(currentRecord.id, info);
          }
        } else {
          await updateUser(currentRecord.id, info);
        }

        toast.success('Cập nhật thành công !');
        router.push(paths.user.root);
      }
      reset();
    } catch (error: any) {
      console.error(error);
      if (error?.statusCode === 409)
        setError(
          'username',
          {
            message: 'Tên đăng nhập đã tồn tại!',
            type: 'custom',
          },
          {
            shouldFocus: true,
          }
        );
    }
  });
  const handleDropFile = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setValue('avatar', file, { shouldValidate: true, shouldDirty: true });
      }
    },
    [setValue]
  );

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Thông tin cá nhân"
        subheader="Thông tin cá nhân của chủ tài khoản..."
        sx={{ mb: 3 }}
      />

      <Divider />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1,1fr)',
            md: 'repeat(2,1fr)',
          },
          gap: 3,
          p: 3,
        }}
      >
        <Box>
          <BlockField label="Hình đại diện">
            <Field.UploadAvatar
              name="avatar"
              disabled={loading}
              maxSize={3145728}
              onDrop={handleDropFile}
              sx={{ width: 250, height: 250 }}
            />
          </BlockField>

          <Field.Switch
            name="status"
            labelPlacement="start"
            label={
              <>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Kích hoạt tài khoản
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Cho phép người dùng đăng nhập vào hệ thống
                </Typography>
              </>
            }
            sx={{ mt: 3, width: 1, justifyContent: 'space-between' }}
          />
        </Box>

        <Stack spacing={3}>
          <BlockField label="Họ và tên" required>
            <Field.Text name="name" size="small" disabled={loading} />
          </BlockField>
          <BlockField label="Ngày sinh" required>
            <Field.DatePicker
              name="birthDate"
              slotProps={{
                textField: {
                  size: 'small',
                },
              }}
              reduceAnimations
              disableFuture
              disabled={loading}
            />
          </BlockField>
          <BlockField label="Email" required>
            <Field.Text name="email" size="small" disabled={loading} />
          </BlockField>
          <BlockField label="Số điện thoại" required>
            <Field.Text name="phone" size="small" disabled={loading} />
          </BlockField>
          <BlockField label="Địa chỉ">
            <Field.Text name="address" size="small" disabled={loading} />
          </BlockField>
        </Stack>
      </Box>
    </Card>
  );
  const renderAuthentication = () => (
    <Card>
      <CardHeader
        title="Thông tin đăng nhập"
        subheader="Cho tài khoản quyền truy cập hệ thống"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <BlockField label="Tên đăng nhập" required>
          <Field.Text name="username" size="small" disabled={loading} />
        </BlockField>

        <BlockField label="Mật khẩu" required>
          <Field.Text name="password" size="small" disabled={loading} />
        </BlockField>
      </Stack>
    </Card>
  );
  const renderOther = () => (
    <Card>
      <CardHeader title="Thông tin khác" subheader="Thông tin liên quan khác" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <BlockField label="Quyền hạn" required>
          <Field.Select name="roleId" size="small" disabled={loading}>
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Field.Select>
        </BlockField>
        <BlockField label="Công ty" required>
          <Field.Select name="companyId" size="small" disabled={loading}>
            {companies.map((company) => (
              <MenuItem key={company.id} value={company.id}>
                {company.name}
              </MenuItem>
            ))}
          </Field.Select>
        </BlockField>
      </Stack>
    </Card>
  );
  const renderActions = () => (
    <Box
      sx={{
        gap: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting || loading}
        disabled={loading || checkingCode.value}
        sx={{ ml: 'auto' }}
      >
        {!isEdit ? 'Thêm tài khoản' : 'Lưu thay đổi'}
      </LoadingButton>
    </Box>
  );
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(1,1fr)', md: 'repeat(2,1fr)' },
            gap: 3,
            ...(isEdit && {
              gridTemplateColumns: 'repeat(1,1fr)',
            }),
          }}
        >
          {!isEdit && renderAuthentication()}
          {renderOther()}
        </Box>
        {renderActions()}
      </Stack>
    </Form>
  );
}
