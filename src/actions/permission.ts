'use client';

import type { SWRConfiguration } from 'swr';
import type { IReqSearchParams } from 'src/types/request';
import type { IApiListResponse } from 'src/types/response';
import type { Permission, PermissionGroup } from 'src/types/permission';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
const ENDPOINT = endpoints.permission;

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type IPermissionsRes = IApiListResponse<Permission[]>;

export function useGetPermissions(params?: Omit<IReqSearchParams, 'perPage'>) {
  const url = [
    ENDPOINT.get_all,
    {
      params: {
        ...params,
        perPage: 1000,
      },
    },
  ];

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<IPermissionsRes>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      permissions: data?.response?.data || [],
      permissionsLoading: isLoading,
      permissionsError: error,
      permissionsValidating: isValidating,
      permissionsEmpty: !isLoading && !isValidating && !data?.response?.data.length,
      permissionsMutate: APIMutate,
    }),
    [data?.response?.data, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------

type IPermissionGroupsRes = IApiListResponse<PermissionGroup[]>;

export function useGetPermissionGroups(params?: Omit<IReqSearchParams, 'perPage'>) {
  const url = [
    ENDPOINT.get_all_by_group,
    {
      params: {
        ...params,
        perPage: 1000,
      },
    },
  ];

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<IPermissionGroupsRes>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      permissions: data?.response?.data || [],
      permissionsLoading: isLoading,
      permissionsError: error,
      permissionsValidating: isValidating,
      permissionsEmpty: !isLoading && !isValidating && !data?.response?.data.length,
      permissionsMutate: APIMutate,
    }),
    [data?.response?.data, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}
