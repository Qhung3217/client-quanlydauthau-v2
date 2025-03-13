'use client';

import type { SWRConfiguration } from 'swr';
import type { Company } from 'src/types/company';
import type { IReqSearchParams } from 'src/types/request';
import type { IApiListResponse, IApiGetOneResponse } from 'src/types/response';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
const ENDPOINT = endpoints.company;

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export type ICompaniesRes = IApiListResponse<Company[]>;
export function useGetCompanies(
  params?: IReqSearchParams & {
    categoryIds?: string[];
  }
) {
  const url = [ENDPOINT.list, { params }];

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<ICompaniesRes>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      companies: data?.response?.data || [],
      companiesMeta: data?.response?.meta,
      companiesLoading: isLoading,
      companiesError: error,
      companiesValidating: isValidating,
      companiesEmpty: !isLoading && !isValidating && !data?.response?.data.length,
      companiesMutate: APIMutate,
    }),
    [data?.response?.data, data?.response?.meta, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCompany(id: string) {
  const url = id ? ENDPOINT.details(id) : '';

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<IApiGetOneResponse<Company>>(url, fetcher, {
    revalidateOnMount: true,
    revalidateIfStale: true,
  });

  const memoizedValue = useMemo(
    () => ({
      company: data?.response,
      companyLoading: isLoading,
      companyError: error,
      companyEmpty: !isLoading && !isValidating && !data?.response?.id,
      companyValidating: isValidating,
      companyMutate: APIMutate,
    }),
    [data?.response, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}
