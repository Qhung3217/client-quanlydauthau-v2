eimport type { IProjectDetails } from 'src/types/project';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Paper, Button, IconButton, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import useInputCurrency from 'src/hooks/use-input-currency';

import { httpErrorHandler } from 'src/utils/http-error-handle';

import { createProject, updateProject } from 'src/actions/project';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import BlockField from 'src/components/hook-form/block-field';

import ProjectPriceField from './_partials/forms/project-price-field';
import ProjectProductField from './_partials/forms/project-product-field';
import ProjectCompanyField from './_partials/forms/project-company-field';
import { ProductEstimateSchema } from './product-estimate-create-edit-form';

// ----------------------------------------------------------------------

export type EstimateSchemaType = zod.infer<typeof EstimateSchema>;

export const EstimateSchema = zod.object({
  name: zod.string().min(1, 'Tên dự án là bắt buộc!'),
  projectId: zod.string().min(1),

  productEstimates: zod.array(ProductEstimateSchema)
    .min(1, 'Danh mục hàng hóa phải có ít nhất 1 sản phẩm!'),

});

// ----------------------------------------------------------------------

type Props = {
  currentRecord?: EstimateSchemaType;
  loading?: boolean;
};

export function EstimateCreateEditForm({ currentRecord, loading }: Props) {
  const { convertToNumber } = useInputCurrency();

  const router = useRouter();

  const checkingCode = useBoolean();

  const isEdit = !!currentRecord;

  const defaultValues: EstimateSchemaType = {
    name: '',
    projectId: '',
    productEstimates: [],
  };

  const currentFormValue = useMemo(() => {
    if (isEdit)
      return {
        ...currentRecord,
     
      };
    return undefined;
  }, [currentRecord, isEdit]);

  const methods = useForm<EstimateSchemaType>({
    resolver: zodResolver(EstimateSchema),
    defaultValues,
    values: currentFormValue,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
    control,
  } = methods;



  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
      if (!isEdit) {
        await createEst({
          ...data,
          price: convertToNumber(data.price),
          companyId: data.companyId.value,

          projectItems: data.projectItems.map((item: any) => ({
            ...item,
            productId: item.productId.value,
          })),
        });

        toast.success('Đã thêm dự án thành công !');
      } else {
        await updateProject(currentRecord.id, {
          ...data,
          price: convertToNumber(data.price),
          companyId: data.companyId.value,
          projectItems: data.projectItems.map((item: any) => ({
            ...item,
            productId: item.productId.value,
          })),
        });

        toast.success('Đã cập nhật dự án thành công !');
        router.push(paths.dashboard.my_project.root);
      }
      reset();
    } catch (error: any) {
      console.error(error);

      toast.error(error.message);

      httpErrorHandler({
        err: error,
        errorKeys: ['name', 'desc', 'projectItems'],
        setFieldErrors: setError,
      });
    }
  });

  const renderDetails = () => (
    <Card>
      <CardHeader title="Thông tin" subheader="Thông tin về dự án..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <BlockField label="Tên dự án" required>
          <Field.Text name="name" size="small" disabled={loading} />
        </BlockField>
        <ProjectPriceField loading={!!loading} />
        <ProjectCompanyField />

        <BlockField label="Địa chỉ">
          <Field.Text name="address" size="small" disabled={loading} />
        </BlockField>
        <BlockField label="Mô tả">
          <Field.Text
            name="desc"
            multiline
            minRows={4}
            maxRows={25}
            size="small"
            disabled={loading}
          />
        </BlockField>
      </Stack>
    </Card>
  );
  const renderProperties = () => (
    <Card>
      <CardHeader
        title="Danh mục sản phẩm"
        subheader="Danh sách sản phẩm của dự án"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <BlockField label="Danh mục sản phẩm">
          {productListField.map((field, index) => (
            <Stack
              component={Paper}
              elevation={1}
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              key={field.id}
              alignItems="flex-start"
              sx={{
                width: 1,
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'background.neutral',
                },
                position: 'relative',
              }}
            >
              <ProjectProductField formIndex={index} />
              <BlockField label="Số lượng" required sx={{ flex: 1, minWidth: 0 }}>
                <Field.Text name={`projectItems.${index}.quantity`} size="small" type="number" />
              </BlockField>
              <BlockField label="Đơn vị tính" required sx={{ flex: 1, minWidth: 0 }}>
                <Field.Text name={`projectItems.${index}.unit`} size="small" />
              </BlockField>
              <IconButton
                onClick={() => {
                  remove(index);
                }}
                sx={{
                  flexShrink: 0,
                  color: 'error.main',
                  alignSelf: 'center',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}
                size="small"
                title="Xóa danh mục này"
              >
                <Iconify icon="ep:remove" />
              </IconButton>
            </Stack>
          ))}
          {productListField.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                mt: 3,
                border: '1px dashed transparent',
                ...(errors.projectItems && {
                  borderColor: 'error.main',
                  backgroundColor: '#fff6f3',
                }),
                borderRadius: 1,
                py: 1.5,
              }}
            >
              <Typography variant="h6">Danh mục hàng hóa rỗng</Typography>
              <Typography variant="caption">
                {/*  eslint-disable-next-line react/no-unescaped-entities */}
                Nhấn nút "Thêm sản phẩm" để thêm sản phẩm
              </Typography>
            </Box>
          )}
          <Button
            onClick={() => {
              append({
                quantity: 1,
                unit: '',
                productId: '',
              });
            }}
            variant="outlined"
            sx={{ maxWidth: { xs: 1, md: 400 }, mx: 'auto', width: 1, mt: 1 }}
            color="info"
          >
            Thêm sản phẩm
          </Button>
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
        {!isEdit ? 'Thêm dự án' : 'Lưu thay đổi'}
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
