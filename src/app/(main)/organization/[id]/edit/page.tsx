'use client';

import { notFound } from 'next/navigation';

import { useGetCompany } from 'src/actions/company';
import { PERMISSION_ENUM } from 'src/constants/permission';

import CompanyEditView from 'src/sections/company/view/company-edit-view';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------
type Props = {
  params: { id: string };
};

export default function Page({ params: { id } }: Props) {
  const { user } = useAuthContext();

  const { company, companyEmpty, companyLoading } = useGetCompany(id);
  if (companyEmpty) return notFound();
  return (
    <RoleBasedGuard
      acceptRoles={[PERMISSION_ENUM.UPDATE_COMPANY]}
      currentRole={user?.permissions}
      hasContent
    >
      <CompanyEditView record={company!} loading={companyLoading} />
    </RoleBasedGuard>
  );
}
