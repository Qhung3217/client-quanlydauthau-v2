import type { Project } from 'src/types/project';
import type { ProductEstimateSchemaType } from 'src/sections/estimate/product-estimate-create-edit-form';

import { useState } from 'react';

import { Box, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { MainContent } from 'src/layouts/main';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProductEstimateCreateEditForm from 'src/sections/estimate/product-estimate-create-edit-form';

import ProductEstimatedList from '../product-estimated-list';

type Props = {
  project: Project | undefined;
  loading: boolean;
};
export default function ProjectEstimateView({ project, loading }: Props) {
  const [productEsts, setProductEsts] = useState<ProductEstimateSchemaType[]>([]);

  const [productEstSelected, setProductEstSelected] = useState<{
    record: ProductEstimateSchemaType;
    index: number;
  } | null>(null);

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
    <MainContent>
      <CustomBreadcrumbs
        heading="Nhập dự toán"
        links={[
          { name: 'Tất cả dự án', href: paths.project.root },
          { name: `#${project?.code}`, href: paths.project.details(project?.id) },
          { name: 'Nhập dự toán' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <Button variant="soft" color="primary">
            Gửi dự toán
          </Button>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1,1fr)',
            md: 'repeat(2,1fr)',
          },
          gap: 2,
        }}
      >
        <ProductEstimatedList
          productEsts={productEsts}
          onSelected={(selected, index) =>
            productEstSelected
              ? setProductEstSelected(null)
              : setProductEstSelected({ record: selected, index })
          }
          selectedIndex={productEstSelected?.index as any}
          onRemove={handleRemove}
        />

        <ProductEstimateCreateEditForm
          onSubmit={(newP) => {
            console.log(newP, productEstSelected);
            if (!productEstSelected) {
              handleInsertProductEst(newP);
            } else {
              handleChangeProductEst(newP);
            }
          }}
          currentRecord={productEstSelected?.record}
        />
      </Box>
    </MainContent>
  );
}
