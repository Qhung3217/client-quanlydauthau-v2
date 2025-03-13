'use client';

import type { SWRConfiguration } from 'swr';
import type { Product } from 'src/types/product';
import type { IReqSearchParams } from 'src/types/request';
import type { IApiListResponse, IApiGetOneResponse } from 'src/types/response';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------
const ENDPOINT = endpoints.product;

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------
export type IProductsRes = IApiListResponse<Product[]>;
export function useGetProducts(
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
  } = useSWR<IProductsRes>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      products: data?.response?.data || [],
      productsMeta: data?.response?.meta,
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !isValidating && !data?.response?.data.length,
      productsMutate: APIMutate,
    }),
    [data?.response?.data, data?.response?.meta, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(id: string) {
  const url = id ? ENDPOINT.details(id) : '';

  const {
    data,
    isLoading,
    error,
    isValidating,
    mutate: APIMutate,
  } = useSWR<IApiGetOneResponse<Product>>(url, fetcher, {
    revalidateOnMount: true,
    revalidateIfStale: true,
  });

  const memoizedValue = useMemo(
    () => ({
      product: data?.response,
      productLoading: isLoading,
      productEmpty: !isLoading && !isValidating && !data?.response?.id,
      productError: error,
      productValidating: isValidating,
      productMutate: APIMutate,
    }),
    [data?.response, error, isLoading, isValidating, APIMutate]
  );

  return memoizedValue;
}
