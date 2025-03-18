import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import { Card, Stack, Button, Typography, CardContent } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import BlockField from 'src/components/hook-form/block-field';

import ProductSelectDialog from '../product/product-select-dialog';

export type ProductEstimateSchemaType = zod.infer<typeof ProductEstimateSchema>;

export const ProductEstimateSchema = zod.object({
  name: zod.string().min(1, 'Tên sản phẩm không được để trống'),

  desc: zod.string().min(1, 'Tên sản phẩm không được để trống'),
});

type Props = {
  currentRecord?: ProductEstimateSchemaType;
  onSubmit: (value: ProductEstimateSchemaType) => void;
};

export default function ProductEstimateCreateEditForm({
  onSubmit: onPassSubmit,
  currentRecord,
}: Props) {
  const showDialogSelectProduct = useBoolean();

  const uploadingThumb = useBoolean();
  const uploadingAttachFiles = useBoolean();

  const defaultValues: ProductEstimateSchemaType = {
    name: '',
    desc: '',
  };

  const methods = useForm<ProductEstimateSchemaType>({
    resolver: zodResolver(ProductEstimateSchema),
    defaultValues,
    values: currentRecord,
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(currentRecord ? currentRecord : { name: '', desc: '' });
  }, [currentRecord]);

  const onSubmit = handleSubmit(async (data) => {
    onPassSubmit({ ...data });
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
    reset({ name: '', desc: '' });
    toast.success('Lưu thành công.');
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Typography
        variant="h6"
        sx={{ color: 'primary.darker', textDecoration: 'underline' }}
        gutterBottom
      >
        Sản phẩm dự toán
      </Typography>

      <Stack spacing={2}>
        <Stack spacing={2}>
          <Card sx={{ position: 'relative' }}>
            <CardContent>
              <Stack spacing={2}>
                <BlockField label="Sản phẩm" required sx={{ position: 'relative' }}>
                  <Field.Text name="name" size="small" />
                  <Button
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: 0,
                    }}
                    startIcon={<Iconify icon="material-symbols:quick-reference-all" />}
                    size="small"
                    onClick={() => {
                      showDialogSelectProduct.onTrue();
                    }}
                    variant="text"
                    color="info"
                  >
                    Chọn nhanh
                  </Button>
                </BlockField>

                <BlockField label="Mô tả" required>
                  <Field.Editor name="desc" resetValue placeholder="Mô tả sản phẩm" />
                </BlockField>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <LoadingButton
          loading={uploadingAttachFiles.value || uploadingThumb.value}
          variant="contained"
          type="submit"
          color="primary"
          sx={{ ml: 'auto', minWidth: 200 }}
        >
          Lưu
        </LoadingButton>
      </Stack>

      <ProductSelectDialog
        open={showDialogSelectProduct.value}
        onClose={showDialogSelectProduct.onFalse}
        onSelected={(product) => {
          reset({
            name: product.name,
            desc: product.desc,
          });

          showDialogSelectProduct.onFalse();
        }}
      />
    </Form>
  );
}
