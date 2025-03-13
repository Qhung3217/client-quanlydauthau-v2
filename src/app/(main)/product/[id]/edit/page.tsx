'use client';

import { notFound } from 'next/navigation';

import { useGetProduct } from 'src/actions/product';
import { PERMISSION_ENUM } from 'src/constants/permission';

import ProductEditView from 'src/sections/product/view/product-edit-view';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------
type Props = {
  params: { id: string };
};

export default function Page({ params: { id } }: Props) {
  const { user } = useAuthContext();

  const { product, productEmpty, productLoading } = useGetProduct(id);
  if (productEmpty) return notFound();
  return (
    <RoleBasedGuard
      acceptRoles={[PERMISSION_ENUM.UPDATE_PRODUCT]}
      currentRole={user?.permissions}
      hasContent
    >
      <ProductEditView record={product!} loading={productLoading} />
    </RoleBasedGuard>
  );
}
