import type { EstimateDetails } from 'src/types/estimate';
import type { ProductEstimateSchemaType } from 'src/sections/estimate/product-estimate-create-edit-form';

import { useState, useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import { Stack, Button, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProjectItem from 'src/sections/project/project-item';
import ProductEstimateCreateEditForm from 'src/sections/estimate/product-estimate-create-edit-form';

import ProductEstimatedList from '../product-estimated-list';
import EstimateCreateEditDialog from '../estimate-create-dialog';
import ProductEstimateEditDialog from '../product-estimate-edit-dialog';

type Props = {
  estimate: EstimateDetails;
  loading: boolean;
};
export default function ProjectEstimateEditView({ estimate, loading }: Props) {
  const project = estimate?.project;

  const [productEsts, setProductEsts] = useState<ProductEstimateSchemaType[]>([]);

  const [productEstSelected, setProductEstSelected] = useState<{
    record: ProductEstimateSchemaType;
    index: number;
  } | null>(null);

  const openEdit = useBoolean();

  const openEstimateForm = useBoolean();

  useEffect(() => {
    setProductEsts(estimate?.productEstimates || []);
  }, [estimate]);

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

  if (loading)
    return (
      <MainContent
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 150 }}
      >
        <CircularProgress size={70} />
      </MainContent>
    );

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
          <Button variant="soft" color="warning" onClick={openEstimateForm.onTrue}>
            Gửi điều chỉnh
          </Button>
        }
      />
      <Stack direction="column" spacing={2}>
        <ProjectItem project={project} />

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
        currentRecord={estimate}
        projectId={estimate?.project.id || ''}
      />
    </MainContent>
  );
}
