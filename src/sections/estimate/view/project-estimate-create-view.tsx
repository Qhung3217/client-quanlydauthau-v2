import type { Project } from 'src/types/project';
import type { ProductEstimateSchemaType } from 'src/sections/estimate/product-estimate-create-edit-form';

import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Paper, Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProductEstimateCreateEditForm from 'src/sections/estimate/product-estimate-create-edit-form';

import ProductEstimatedList from '../product-estimated-list';
import EstimateCreateEditDialog from '../estimate-create-dialog';
import ProductEstimateEditDialog from '../product-estimate-edit-dialog';

type Props = {
  project: Project | undefined;
  loading: boolean;
};
export default function ProjectEstimateCreateView({ project, loading }: Props) {
  const [productEsts, setProductEsts] = useState<ProductEstimateSchemaType[]>([]);

  const [productEstSelected, setProductEstSelected] = useState<{
    record: ProductEstimateSchemaType;
    index: number;
  } | null>(null);

  const openEdit = useBoolean();

  const openEstimateForm = useBoolean();

  const handleInsertProductEst = (product: ProductEstimateSchemaType) => {
    setProductEsts([...productEsts, product]);
  };

  const handleRemove = (index: number) => {
    const newArr = [...productEsts];
    newArr.splice(index, 1);

    setProductEsts(newArr);
  };

  const handleChangeProductEst = (newValue: ProductEstimateSchemaType) => {
    if (!productEstSelected) return;
    const newArr = [...productEsts];
    newArr[productEstSelected.index] = newValue;
    setProductEsts(newArr);
  };

  return (
    <MainContent sx={{ position: 'relative' }}>
      <CustomBreadcrumbs
        heading="Nhập dự toán"
        links={[
          { name: 'Tất cả dự án', href: paths.project.root },
          { name: `#${project?.code}`, href: paths.project.details(project?.id) },
          { name: 'Nhập dự toán' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <Button variant="soft" color="primary" onClick={openEstimateForm.onTrue}>
            Gửi dự toán
          </Button>
        }
      />
      <Stack direction="column" spacing={2}>
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5"> Giới thiệu chung về dự án</Typography>
          <Typography>
            - <strong>Dự án: </strong> {project?.name}
          </Typography>
          <Typography>
            - <strong>Bên mời thầu: </strong> {project?.inviter?.name}
          </Typography>
          <Typography>
            - <strong>Chủ đầu từ: </strong> {project?.investor?.name}
          </Typography>
          <Typography>
            - <strong>Địa điểm: </strong> {project?.address}
          </Typography>
        </Paper>

        <ProductEstimatedList
          productEsts={productEsts}
          onSelected={(selected, index) => {
            setProductEstSelected({ record: selected, index });
            openEdit.onTrue();
          }}
          selectedIndex={productEstSelected?.index as any}
          onRemove={handleRemove}
        />

        <ProductEstimateCreateEditForm
          onSubmit={handleInsertProductEst}
          currentRecord={productEstSelected?.record}
        />
      </Stack>
      <ProductEstimateEditDialog
        product={productEstSelected?.record}
        onClose={() => {
          openEdit.onFalse();
          setProductEstSelected(null);
        }}
        open={openEdit.value}
        onSubmit={handleChangeProductEst}
      />
      <EstimateCreateEditDialog
        open={openEstimateForm.value}
        onClose={openEstimateForm.onFalse}
        productEstimates={productEsts}
        projectId={project?.id || ''}
      />
    </MainContent>
  );
}
