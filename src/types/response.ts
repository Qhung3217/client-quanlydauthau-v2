import type { HttpStatusCode } from 'axios';

export type IPaginate = {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: any;
  next: number;
  totalPages: number;
};

export type IApiResponse<T> = {
  statusCode: HttpStatusCode;
  message: string;
  response: T;
};

export type IApiListResponse<T> = IApiResponse<{
  data: T;
  meta: IPaginate;
}>;

export type IApiGetOneResponse<T> = IApiResponse<T>;
