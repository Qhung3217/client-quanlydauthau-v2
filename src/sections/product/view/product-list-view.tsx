'use client';

import type { Product } from 'src/types/product';

import { useState } from 'react';

import { Box, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { MainContent } from 'src/layouts/main';
import { PERMISSION_ENUM } from 'src/constants/permission';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import useCheckPermission from 'src/auth/hooks/use-check-permission';

import ProductList from '../product-list';
import ProductDetailsPanel from '../product-details-panel';

export default function ProductListView() {
  const [productSelected, setProductSelected] = useState<Product | null>(null);

  const { CREATE_PERMIT } = useCheckPermission({
    CREATE_PERMIT: PERMISSION_ENUM.CREATE_PRODUCT,
  });

  return (
    <MainContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Danh sách sản phẩm"
        links={[{ name: 'Sản phẩm', href: paths.product.root }, { name: 'Danh sách' }]}
        action={
          CREATE_PERMIT && (
            <Button
              component={RouterLink}
              href={paths.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Sản phẩm mới
            </Button>
          )
        }
        sx={{ mb: { xs: 3, md: 5 } }}
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
        <ProductList
          onSelected={setProductSelected}
          resetSelected={() => setProductSelected(null)}
        />
        <ProductDetailsPanel product={productSelected} />
      </Box>
    </MainContent>
  );
}
