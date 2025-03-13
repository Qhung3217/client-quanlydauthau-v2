'use client';

import type { Product } from 'src/types/product';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
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

import { createProduct, updateProduct } from 'src/actions/product-ssr';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import BlockField from 'src/components/hook-form/block-field';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Tên sản phẩm là bắt buộc!' }),

  //
  desc: zod.string().min(1, { message: 'Đặc tính cơ sở/đề xuất là bắt buộc!' }),
});

// ----------------------------------------------------------------------

type Props = {
  currentRecord?: Product;
  loading?: boolean;
};

export function ProductNewEditForm({ currentRecord, loading }: Props) {
  const router = useRouter();

  const checkingCode = useBoolean();

  const isEdit = !!currentRecord;

  const recordFormData = useMemo(() => {
    if (!isEdit) return undefined;
    return {
      ...currentRecord,
    };
  }, [currentRecord, isEdit]);

  const defaultValues: NewProductSchemaType = {
    name: '',
    desc: '',
  };

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
    values: recordFormData,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!isEdit) {
        await createProduct(data);

        toast.success('Đã thêm sản phẩm thành công !');
      } else {
        await updateProduct(currentRecord.id, data);

        toast.success('Đã cập nhật sản phẩm thành công !');
        router.push(paths.product.root);
      }
      reset();
    } catch (error: any) {
      console.error(error);
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Thông tin" subheader="Thông tin về sản phẩm..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <BlockField label="Tên sản phẩm" required>
          <Field.Text name="name" size="small" disabled={loading} />
        </BlockField>

        <BlockField label="Đặc tính cơ sở/đề xuất" required>
          <Field.Editor name="desc" />
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
        {!isEdit ? 'Thêm sản phẩm' : 'Lưu thay đổi'}
      </LoadingButton>
    </Box>
  );
  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}
        {renderActions()}
      </Stack>
    </Form>
  );
}
