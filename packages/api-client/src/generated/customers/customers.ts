// ⚠️  AUTO-GENERATED — DO NOT EDIT MANUALLY
// Re-generate with: pnpm gen:contract (from repo root)
// Source: services/backend /openapi.json → Orval
// @see packages/api-client/orval.config.ts
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  CreateCustomer201,
  CreateCustomer400,
  CreateCustomerBody,
  GetCustomer200,
  GetCustomer404,
  GetCustomerParams,
  ListCustomers200Item,
  ListCustomersParams,
  UpdateCustomer200,
  UpdateCustomer404,
  UpdateCustomerBody,
  UpdateCustomerParams
} from '../restaurantAPI.schemas';

import { customInstance } from '../../lib/custom-instance';
import type { ErrorType } from '../../lib/custom-instance';




/**
 * @summary List customers with order count and total spend
 */
export const listCustomers = (
    params: ListCustomersParams,
 signal?: AbortSignal
) => {
      
      
      return customInstance<ListCustomers200Item[]>(
      {url: `/api/customers`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getListCustomersQueryKey = (params?: ListCustomersParams,) => {
    return [
    `/api/customers`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getListCustomersQueryOptions = <TData = Awaited<ReturnType<typeof listCustomers>>, TError = ErrorType<unknown>>(params: ListCustomersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listCustomers>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListCustomersQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof listCustomers>>> = ({ signal }) => listCustomers(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listCustomers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData> }
}

export type ListCustomersQueryResult = NonNullable<Awaited<ReturnType<typeof listCustomers>>>
export type ListCustomersQueryError = ErrorType<unknown>


export function useListCustomers<TData = Awaited<ReturnType<typeof listCustomers>>, TError = ErrorType<unknown>>(
 params: ListCustomersParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof listCustomers>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listCustomers>>,
          TError,
          Awaited<ReturnType<typeof listCustomers>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useListCustomers<TData = Awaited<ReturnType<typeof listCustomers>>, TError = ErrorType<unknown>>(
 params: ListCustomersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listCustomers>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listCustomers>>,
          TError,
          Awaited<ReturnType<typeof listCustomers>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useListCustomers<TData = Awaited<ReturnType<typeof listCustomers>>, TError = ErrorType<unknown>>(
 params: ListCustomersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listCustomers>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
/**
 * @summary List customers with order count and total spend
 */

export function useListCustomers<TData = Awaited<ReturnType<typeof listCustomers>>, TError = ErrorType<unknown>>(
 params: ListCustomersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listCustomers>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {

  const queryOptions = getListCustomersQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Create a customer
 */
export const createCustomer = (
    createCustomerBody: CreateCustomerBody,
 signal?: AbortSignal
) => {
      
      
      return customInstance<CreateCustomer201>(
      {url: `/api/customers`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createCustomerBody, signal
    },
      );
    }
  


export const getCreateCustomerMutationOptions = <TError = ErrorType<CreateCustomer400>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createCustomer>>, TError,{data: CreateCustomerBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof createCustomer>>, TError,{data: CreateCustomerBody}, TContext> => {

const mutationKey = ['createCustomer'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createCustomer>>, {data: CreateCustomerBody}> = (props) => {
          const {data} = props ?? {};

          return  createCustomer(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type CreateCustomerMutationResult = NonNullable<Awaited<ReturnType<typeof createCustomer>>>
    export type CreateCustomerMutationBody = CreateCustomerBody
    export type CreateCustomerMutationError = ErrorType<CreateCustomer400>

    /**
 * @summary Create a customer
 */
export const useCreateCustomer = <TError = ErrorType<CreateCustomer400>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createCustomer>>, TError,{data: CreateCustomerBody}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createCustomer>>,
        TError,
        {data: CreateCustomerBody},
        TContext
      > => {

      const mutationOptions = getCreateCustomerMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Get customer detail with recent orders
 */
export const getCustomer = (
    params: GetCustomerParams,
 signal?: AbortSignal
) => {
      
      
      return customInstance<GetCustomer200>(
      {url: `/api/customers/:id`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetCustomerQueryKey = (params?: GetCustomerParams,) => {
    return [
    `/api/customers/:id`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetCustomerQueryOptions = <TData = Awaited<ReturnType<typeof getCustomer>>, TError = ErrorType<GetCustomer404>>(params: GetCustomerParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCustomer>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCustomerQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCustomer>>> = ({ signal }) => getCustomer(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getCustomer>>, TError, TData> & { queryKey: DataTag<QueryKey, TData> }
}

export type GetCustomerQueryResult = NonNullable<Awaited<ReturnType<typeof getCustomer>>>
export type GetCustomerQueryError = ErrorType<GetCustomer404>


export function useGetCustomer<TData = Awaited<ReturnType<typeof getCustomer>>, TError = ErrorType<GetCustomer404>>(
 params: GetCustomerParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCustomer>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCustomer>>,
          TError,
          Awaited<ReturnType<typeof getCustomer>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useGetCustomer<TData = Awaited<ReturnType<typeof getCustomer>>, TError = ErrorType<GetCustomer404>>(
 params: GetCustomerParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCustomer>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCustomer>>,
          TError,
          Awaited<ReturnType<typeof getCustomer>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useGetCustomer<TData = Awaited<ReturnType<typeof getCustomer>>, TError = ErrorType<GetCustomer404>>(
 params: GetCustomerParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCustomer>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
/**
 * @summary Get customer detail with recent orders
 */

export function useGetCustomer<TData = Awaited<ReturnType<typeof getCustomer>>, TError = ErrorType<GetCustomer404>>(
 params: GetCustomerParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCustomer>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {

  const queryOptions = getGetCustomerQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Update a customer
 */
export const updateCustomer = (
    updateCustomerBody: UpdateCustomerBody,
    params: UpdateCustomerParams,
 ) => {
      
      
      return customInstance<UpdateCustomer200>(
      {url: `/api/customers/:id`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateCustomerBody,
        params
    },
      );
    }
  


export const getUpdateCustomerMutationOptions = <TError = ErrorType<UpdateCustomer404>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateCustomer>>, TError,{data: UpdateCustomerBody;params: UpdateCustomerParams}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof updateCustomer>>, TError,{data: UpdateCustomerBody;params: UpdateCustomerParams}, TContext> => {

const mutationKey = ['updateCustomer'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateCustomer>>, {data: UpdateCustomerBody;params: UpdateCustomerParams}> = (props) => {
          const {data,params} = props ?? {};

          return  updateCustomer(data,params,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type UpdateCustomerMutationResult = NonNullable<Awaited<ReturnType<typeof updateCustomer>>>
    export type UpdateCustomerMutationBody = UpdateCustomerBody
    export type UpdateCustomerMutationError = ErrorType<UpdateCustomer404>

    /**
 * @summary Update a customer
 */
export const useUpdateCustomer = <TError = ErrorType<UpdateCustomer404>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateCustomer>>, TError,{data: UpdateCustomerBody;params: UpdateCustomerParams}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateCustomer>>,
        TError,
        {data: UpdateCustomerBody;params: UpdateCustomerParams},
        TContext
      > => {

      const mutationOptions = getUpdateCustomerMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    