import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { updateProfile } from 'src/actions/profile';
import { uploadSingleFile } from 'src/actions/media';
import { PERMISSION_ENUM } from 'src/constants/permission';

import { toast } from 'src/components/snackbar';
import BlockField from 'src/components/hook-form/block-field';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import useCheckPermission from 'src/auth/hooks/use-check-permission';

// ----------------------------------------------------------------------

export type NewAccountSchemaType = zod.infer<typeof NewAccountSchema>;

export const NewAccountSchema = zod.object({
  name: zod.string().min(1, 'Tên người dùng là bắt buộc!'),

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

// ----------------------------------------------------------------------

export function MyProfileForm() {
  const { user, checkUserSession } = useAuthContext();

  const { UPDATE_PERMIT } = useCheckPermission({
    UPDATE_PERMIT: PERMISSION_ENUM.UPDATE_MY_PROFILE,
  });

  const loading = !user;

  const recordFormData = useMemo(() => {
    if (!user) return undefined;
    return {
      ...(user as any),

      avatar: user.avatar,
    };
  }, [user]);

  const defaultValues: NewAccountSchemaType = {
    name: '',
    birthDate: '',
    email: '',
    phone: '',
    avatar: '',
    address: '',
  };

  const methods = useForm<NewAccountSchemaType>({
    resolver: zodResolver(NewAccountSchema),
    defaultValues,
    values: recordFormData,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, dirtyFields },

    setValue,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { avatar, ...info } = data;

      if (dirtyFields.avatar) {
        if (avatar) {
          const avatarUrl = await uploadSingleFile(avatar as File);
          await updateProfile({ ...info, avatar: avatarUrl.path });
        } else {
          await updateProfile(info);
        }
      } else {
        await updateProfile(info);
      }

      toast.success('Cập nhật thành công !');

      await checkUserSession?.();
      reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
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
      <CardHeader title="Thông tin tài khoản" subheader="Thông tin của tài khoản" sx={{ mb: 3 }} />

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
              sx={{ width: 250, height: 250 }}
              {...(UPDATE_PERMIT && {
                onDrop: handleDropFile,
              })}
            />
          </BlockField>
        </Box>

        <Stack spacing={3}>
          <BlockField label="Họ và tên" required>
            <Field.Text
              name="name"
              size="small"
              disabled={loading}
              slotProps={{
                input: {
                  readOnly: !UPDATE_PERMIT,
                },
              }}
            />
          </BlockField>
          <BlockField label="Ngày sinh" required>
            <Field.DatePicker
              name="birthDate"
              slotProps={{
                textField: {
                  size: 'small',
                  slotProps: {
                    input: {
                      readOnly: !UPDATE_PERMIT,
                    },
                  },
                },
              }}
              reduceAnimations
              disableFuture
              disabled={loading}
            />
          </BlockField>
          <BlockField label="Email" required>
            <Field.Text
              name="email"
              size="small"
              disabled={loading}
              slotProps={{
                input: {
                  readOnly: !UPDATE_PERMIT,
                },
              }}
            />
          </BlockField>
          <BlockField label="Số điện thoại" required>
            <Field.Text
              name="phone"
              size="small"
              disabled={loading}
              slotProps={{
                input: {
                  readOnly: !UPDATE_PERMIT,
                },
              }}
            />
          </BlockField>
          <BlockField label="Địa chỉ">
            <Field.Text
              name="address"
              size="small"
              disabled={loading}
              slotProps={{
                input: {
                  readOnly: !UPDATE_PERMIT,
                },
              }}
            />
          </BlockField>
        </Stack>
      </Box>
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
        disabled={loading}
        sx={{ ml: 'auto' }}
      >
        Lưu thay đổi
      </LoadingButton>
    </Box>
  );
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}

        {UPDATE_PERMIT && renderActions()}
      </Stack>
    </Form>
  );
}
