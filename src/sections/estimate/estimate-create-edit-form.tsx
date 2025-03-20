import type { EstimateDetails } from 'src/types/estimate';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import { Box, Paper } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createEstimate, updateEstimate } from 'src/actions/estimate-ssr';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import BlockField from 'src/components/hook-form/block-field';

import { ProductEstimateSchema } from './product-estimate-create-edit-form';

import type { ProductEstimateSchemaType } from './product-estimate-create-edit-form';

// ----------------------------------------------------------------------

export type EstimateSchemaType = zod.infer<typeof EstimateSchema>;

export const EstimateSchema = zod.object({
  name: zod.string().min(1, 'Tên dự án là bắt buộc!'),
  projectId: zod.string().min(1),

  productEstimates: zod
    .array(ProductEstimateSchema)
    .min(1, 'Danh mục hàng hóa phải có ít nhất 1 sản phẩm!'),
});

// ----------------------------------------------------------------------

type Props = {
  currentRecord?: EstimateDetails;
  projectId: string;
  productEstimates: ProductEstimateSchemaType[];
  loading?: boolean;
  btnRef?: React.RefObject<HTMLButtonElement>;
  onLoading?: (loading: boolean) => void;
  onSubmit?: () => void;
};

export function EstimateCreateEditForm({
  currentRecord,
  loading,
  projectId,
  productEstimates,
  btnRef,
  onLoading,
  onSubmit: emitSubmit,
}: Props) {
  const router = useRouter();

  const checkingCode = useBoolean();

  const isEdit = !!currentRecord;

  const defaultValues: EstimateSchemaType = {
    name: '',
    projectId: projectId || '',
    productEstimates: productEstimates || [],
  };

  const currentFormValue = useMemo(() => {
    if (isEdit)
      return {
        ...currentRecord,
        productEstimates,
        projectId: currentRecord.project.id,
      };
    return undefined;
  }, [currentRecord, isEdit, productEstimates]);

  const methods = useForm<EstimateSchemaType>({
    resolver: zodResolver(EstimateSchema),
    defaultValues,
    values: currentFormValue,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      onLoading?.(true);
      if (!isEdit) {
        await createEstimate({
          ...data,
        });

        toast.success('Đã gửi dự toán thành công !');
      } else {
        await updateEstimate(currentRecord.id, {
          ...data,
        });

        toast.success('Đã điều chỉnh dự toán thành công !');
      }
      emitSubmit?.();
      reset();
      router.push(paths.project.details(projectId));
    } catch (error: any) {
      console.error(error);

      toast.error(error.message);
    } finally {
      onLoading?.(false);
    }
  });

  const renderDetails = () => (
    <Paper>
      <Stack spacing={3}>
        <BlockField label="Tiêu đề" required>
          <Field.Text name="name" size="small" disabled={loading} />
        </BlockField>
      </Stack>
    </Paper>
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
      {btnRef !== undefined ? (
        <button ref={btnRef} type="submit" style={{ display: 'none' }}>
          submit
        </button>
      ) : (
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting || loading}
          disabled={loading || checkingCode.value}
          sx={{ ml: 'auto' }}
        >
          {!isEdit ? 'Thêm dự án' : 'Lưu thay đổi'}
        </LoadingButton>
      )}
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
