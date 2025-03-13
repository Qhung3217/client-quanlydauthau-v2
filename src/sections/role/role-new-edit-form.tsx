'use client';

import type { Role } from 'src/types/role';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { Box, Button } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createRole, updateRole } from 'src/actions/role-ssr';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import BlockField from 'src/components/hook-form/block-field';

import RolePermissionDialog from './role-permission-dialog';

// ----------------------------------------------------------------------

export type NewRoleSchemaType = zod.infer<typeof NewRoleSchema>;

export const NewRoleSchema = zod.object({
  name: zod.string().min(1, { message: 'Tên nhóm quyền là bắt buộc!' }),

  permissionCodes: zod.string().array().min(1, 'Quyền hạn chưa được chọn!'),
});

// ----------------------------------------------------------------------

type Props = {
  currentRecord?: Role;
  loading?: boolean;
};

export function RoleNewEditForm({ currentRecord, loading }: Props) {
  const router = useRouter();

  const checkingCode = useBoolean();

  const openPermissionDialog = useBoolean();

  const isEdit = !!currentRecord;

  const recordFormData = useMemo(() => {
    if (!isEdit) return undefined;
    return {
      name: currentRecord.name,
      permissionCodes: currentRecord.permissions.map((p) => p.code),
    };
  }, [currentRecord, isEdit]);

  const defaultValues: NewRoleSchemaType = {
    name: '',
    permissionCodes: [],
  };

  const methods = useForm<NewRoleSchemaType>({
    resolver: zodResolver(NewRoleSchema),
    defaultValues,
    values: recordFormData,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    watch,
    setValue,
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!isEdit) {
        await createRole(data);

        toast.success('Thêm thành công !');
      } else {
        await updateRole(currentRecord.id, data);

        toast.success('Cập nhật thành công !');
        router.push(paths.role.root);
      }
      reset();
    } catch (error: any) {
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Thông tin" subheader="Thông tin về nhóm quyền..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <BlockField label="Tên nhóm quyền" required>
          <Field.Text name="name" size="small" disabled={loading} />
        </BlockField>
      </Stack>
    </Card>
  );
  const renderProperties = () => (
    <Card>
      <CardHeader title="Quyền hạn" subheader="Gán quyền hạn cho nhóm quyền" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <BlockField label="Danh sách quyền hạn">
          <Button
            variant="outlined"
            sx={{ maxWidth: { xs: 1, md: 400 }, mx: 'auto', width: 1, mt: 2 }}
            color={
              errors.permissionCodes ? 'error' : values.permissionCodes.length ? 'success' : 'info'
            }
            onClick={openPermissionDialog.onTrue}
          >
            {values.permissionCodes.length
              ? `${values.permissionCodes.length} quyền hạn đã chọn`
              : errors.permissionCodes
                ? 'Chưa chọn quyền hạn!'
                : 'Chọn quyền hạn'}
          </Button>

          <RolePermissionDialog
            open={openPermissionDialog.value}
            onClose={openPermissionDialog.onFalse}
            selected={values.permissionCodes}
            onSelectChange={(newValue) =>
              setValue('permissionCodes', newValue, {
                shouldValidate: true,
              })
            }
            key={`${values.permissionCodes.length}+${openPermissionDialog.value}`}
          />
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
        {!isEdit ? 'Thêm nhóm quyền' : 'Lưu thay đổi'}
      </LoadingButton>
    </Box>
  );
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}
        {renderProperties()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
