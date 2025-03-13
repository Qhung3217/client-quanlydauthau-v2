'use client';

import type { Company } from 'src/types/company';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { uploadSingleFile } from 'src/actions/media';
import { createCompany, updateCompany } from 'src/actions/company-ssr';

import { toast } from 'src/components/snackbar';
import BlockField from 'src/components/hook-form/block-field';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewCompanySchemaType = zod.infer<typeof NewCompanySchema>;

export const NewCompanySchema = zod.object({
  name: zod.string().min(1, { message: 'Tên đơn vị là bắt buộc!' }),
  email: zod.string().refine(
    (value) => {
      // Nếu là chuỗi rỗng, bỏ qua validate email
      if (value === '') return true;
      // Nếu khác chuỗi rỗng, kiểm tra định dạng email
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    {
      message: 'Email không hợp lệ', // Thông báo lỗi khi không thỏa mãn
    }
  ),
  phone: zod
    .string()
    .min(1, { message: 'Số điện thoại là bắt buộc!' })
    .refine(
      (value) => value.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
      'Số điện thoại không hợp lệ!'
    ),
  address: zod.string(),
  tax: zod.string(),
  website: zod.string(),
  logo: schemaHelper.file({ required: true, message: 'Logo là bắt buộc!' }),
  representativeName: zod.string(),
  representativePosition: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentRecord?: Company;
  loading?: boolean;
};

export function CompanyNewEditForm({ currentRecord, loading }: Props) {
  const router = useRouter();

  const checkingCode = useBoolean();

  const isEdit = !!currentRecord;

  const recordFormData = useMemo(() => {
    if (!isEdit) return undefined;
    return {
      ...currentRecord,
      logo: currentRecord.logo,
    };
  }, [currentRecord, isEdit]);

  const defaultValues: NewCompanySchemaType = {
    name: '',
    email: '',
    phone: '',
    address: '',
    tax: '',
    website: '',
    logo: null,
    representativeName: '',
    representativePosition: '',
  };

  const methods = useForm<NewCompanySchemaType>({
    resolver: zodResolver(NewCompanySchema),
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
        const { logo, ...rest } = data;

        const logoURL = await uploadSingleFile(logo as File);
        await createCompany({
          logo: logoURL.path,
          ...rest,
        });

        toast.success('Thêm thành công !');
      } else {
        const { logo, ...rest } = data;
        if (dirtyFields.logo) {
          const logoURL = await uploadSingleFile(logo as File);
          await updateCompany(currentRecord.id, { logo: logoURL.path, ...rest });
        } else {
          await updateCompany(currentRecord.id, rest);
        }

        toast.success('Cập nhật thành công !');
        router.push(paths.organization.root);
      }
      reset();
    } catch (error: any) {
      console.error(error);
      toast.error('Đã có lỗi xảy ra !');
    }
  });

  const handleDropFile = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setValue('logo', file, { shouldValidate: true, shouldDirty: true });
      }
    },
    [setValue]
  );
  const renderInfo = () => (
    <Card>
      <CardHeader title="Thông tin" subheader="Thông tin về đơn vị" sx={{ mb: 3 }} />

      <Divider />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1,1fr)',
            md: 'repeat(2,1fr)',
          },
          p: 3,
        }}
      >
        <BlockField label="Logo" required>
          <Field.UploadAvatar
            name="logo"
            disabled={loading}
            maxSize={3145728}
            onDrop={handleDropFile}
          />
        </BlockField>
        <Stack spacing={3} sx={{}}>
          <BlockField label="Tên đơn vị" required>
            <Field.Text name="name" size="small" disabled={loading} />
          </BlockField>
          <BlockField label="Mã số thuế">
            <Field.Text name="tax" size="small" disabled={loading} />
          </BlockField>
          <BlockField label="Địa chỉ trang chủ">
            <Field.Text name="website" size="small" disabled={loading} />
          </BlockField>
        </Stack>
      </Box>
    </Card>
  );
  const renderContact = () => (
    <Card>
      <CardHeader title="Liên hệ" subheader="Thông tin liên hệ" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <BlockField label="Số điện thoại" required>
          <Field.Text name="phone" size="small" disabled={loading} />
        </BlockField>
        <BlockField label="Email">
          <Field.Text name="email" size="small" disabled={loading} />
        </BlockField>
        <BlockField label="Địa chỉ">
          <Field.Text name="address" size="small" disabled={loading} />
        </BlockField>
      </Stack>
    </Card>
  );
  const renderRepresentative = () => (
    <Card>
      <CardHeader title="Đại diện" subheader="Thông tin đại diện" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <BlockField label="Người đại diện">
          <Field.Text name="representativeName" size="small" disabled={loading} />
        </BlockField>
        <BlockField label="Chức vụ">
          <Field.Text name="representativePosition" size="small" disabled={loading} />
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
        {!isEdit ? 'Thêm đơn vị' : 'Lưu thay đổi'}
      </LoadingButton>
    </Box>
  );
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderInfo()}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1,1fr)',
              md: 'repeat(2,1fr)',
            },
            gap: 3,
          }}
        >
          {renderContact()}
          {renderRepresentative()}
        </Box>
        {renderActions()}
      </Stack>
    </Form>
  );
}
