import { z as zod } from 'zod';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import { Card, Stack, Button, Portal, Typography, CardContent } from '@mui/material';

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
  btnRef?: React.RefObject<HTMLButtonElement>;
};

export default function ProductEstimateCreateEditForm({
  onSubmit: onPassSubmit,
  currentRecord,
  btnRef,
}: Props) {
  const isEdit = !!currentRecord;

  const showDialogSelectProduct = useBoolean();

  const defaultValues: ProductEstimateSchemaType = {
    name: '',
    desc: '',
  };

  const methods = useForm<ProductEstimateSchemaType>({
    resolver: zodResolver(ProductEstimateSchema),
    defaultValues,
    values: currentRecord,
  });

  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    reset(currentRecord ? currentRecord : { name: '', desc: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRecord]);

  const onSubmit = handleSubmit(async (data) => {
    onPassSubmit({ ...data });
    reset({ name: '', desc: '' });
    toast.success('Lưu thành công.');
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      {!btnRef && (
        <Typography variant="h5" gutterBottom>
          Thêm hàng hóa
        </Typography>
      )}

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
        {btnRef !== undefined ? (
          <button ref={btnRef} type="submit" style={{ display: 'none' }}>
            submit
          </button>
        ) : (
          <LoadingButton
            variant="contained"
            type="submit"
            color="primary"
            sx={{ ml: 'auto', minWidth: 200 }}
          >
            {isEdit ? 'Lưu' : 'Thêm'}
          </LoadingButton>
        )}
      </Stack>
      <Portal>
        <ProductSelectDialog
          open={showDialogSelectProduct.value}
          onClose={showDialogSelectProduct.onFalse}
          onSelected={(product) => {
            reset({
              name: product.name,
              desc: product.desc,
            });
            setValue('desc', product.desc);

            setTimeout(() => {
              document.body.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);

            showDialogSelectProduct.onFalse();
          }}
        />
      </Portal>
    </Form>
  );
}
