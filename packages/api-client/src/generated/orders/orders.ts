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
  ApplyOrderAction200,
  ApplyOrderAction404,
  ApplyOrderAction422,
  ApplyOrderActionBody,
  ApplyOrderActionParams,
  CreateOrder201,
  CreateOrder400,
  CreateOrder404,
  CreateOrder409,
  CreateOrder422,
  CreateOrderBody,
  GetOrder200,
  GetOrder404,
  GetOrderParams,
  ListOrders200Item,
  ListOrdersParams
} from '../restaurantAPI.schemas';

import { customInstance } from '../../lib/custom-instance';
import type { ErrorType } from '../../lib/custom-instance';




/**
 * @summary List orders (filterable by status and customer)
 */
export const listOrders = (
    params: ListOrdersParams,
 signal?: AbortSignal
) => {
      
      
      return customInstance<ListOrders200Item[]>(
      {url: `/api/orders`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getListOrdersQueryKey = (params?: ListOrdersParams,) => {
    return [
    `/api/orders`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getListOrdersQueryOptions = <TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(params: ListOrdersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListOrdersQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof listOrders>>> = ({ signal }) => listOrders(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData> & { queryKey: DataTag<QueryKey, TData> }
}

export type ListOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof listOrders>>>
export type ListOrdersQueryError = ErrorType<unknown>


export function useListOrders<TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(
 params: ListOrdersParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listOrders>>,
          TError,
          Awaited<ReturnType<typeof listOrders>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useListOrders<TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(
 params: ListOrdersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listOrders>>,
          TError,
          Awaited<ReturnType<typeof listOrders>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useListOrders<TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(
 params: ListOrdersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
/**
 * @summary List orders (filterable by status and customer)
 */

export function useListOrders<TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(
 params: ListOrdersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {

  const queryOptions = getListOrdersQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Validates ordering settings, menu item availability, and restaurant ownership. Computes all prices server-side — totalAmount is never client-controlled.
 * @summary Create a new order
 */
export const createOrder = (
    createOrderBody: CreateOrderBody,
 signal?: AbortSignal
) => {
      
      
      return customInstance<CreateOrder201>(
      {url: `/api/orders`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createOrderBody, signal
    },
      );
    }
  


export const getCreateOrderMutationOptions = <TError = ErrorType<CreateOrder400 | CreateOrder404 | CreateOrder409 | CreateOrder422>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError,{data: CreateOrderBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError,{data: CreateOrderBody}, TContext> => {

const mutationKey = ['createOrder'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createOrder>>, {data: CreateOrderBody}> = (props) => {
          const {data} = props ?? {};

          return  createOrder(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type CreateOrderMutationResult = NonNullable<Awaited<ReturnType<typeof createOrder>>>
    export type CreateOrderMutationBody = CreateOrderBody
    export type CreateOrderMutationError = ErrorType<CreateOrder400 | CreateOrder404 | CreateOrder409 | CreateOrder422>

    /**
 * @summary Create a new order
 */
export const useCreateOrder = <TError = ErrorType<CreateOrder400 | CreateOrder404 | CreateOrder409 | CreateOrder422>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError,{data: CreateOrderBody}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createOrder>>,
        TError,
        {data: CreateOrderBody},
        TContext
      > => {

      const mutationOptions = getCreateOrderMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Get order detail with items and customer
 */
export const getOrder = (
    params: GetOrderParams,
 signal?: AbortSignal
) => {
      
      
      return customInstance<GetOrder200>(
      {url: `/api/orders/:id`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getGetOrderQueryKey = (params?: GetOrderParams,) => {
    return [
    `/api/orders/:id`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getGetOrderQueryOptions = <TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<GetOrder404>>(params: GetOrderParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetOrderQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getOrder>>> = ({ signal }) => getOrder(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData> & { queryKey: DataTag<QueryKey, TData> }
}

export type GetOrderQueryResult = NonNullable<Awaited<ReturnType<typeof getOrder>>>
export type GetOrderQueryError = ErrorType<GetOrder404>


export function useGetOrder<TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<GetOrder404>>(
 params: GetOrderParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getOrder>>,
          TError,
          Awaited<ReturnType<typeof getOrder>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useGetOrder<TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<GetOrder404>>(
 params: GetOrderParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getOrder>>,
          TError,
          Awaited<ReturnType<typeof getOrder>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useGetOrder<TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<GetOrder404>>(
 params: GetOrderParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
/**
 * @summary Get order detail with items and customer
 */

export function useGetOrder<TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<GetOrder404>>(
 params: GetOrderParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {

  const queryOptions = getGetOrderQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * Valid actions: accept, start_preparing, mark_ready, complete, cancel. Transitions are validated server-side — invalid transitions return 422.
 * @summary Transition order status via a named action
 */
export const applyOrderAction = (
    applyOrderActionBody: ApplyOrderActionBody,
    params: ApplyOrderActionParams,
 signal?: AbortSignal
) => {
      
      
      return customInstance<ApplyOrderAction200>(
      {url: `/api/orders/:id/actions`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: applyOrderActionBody,
        params, signal
    },
      );
    }
  


export const getApplyOrderActionMutationOptions = <TError = ErrorType<ApplyOrderAction404 | ApplyOrderAction422>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof applyOrderAction>>, TError,{data: ApplyOrderActionBody;params: ApplyOrderActionParams}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof applyOrderAction>>, TError,{data: ApplyOrderActionBody;params: ApplyOrderActionParams}, TContext> => {

const mutationKey = ['applyOrderAction'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof applyOrderAction>>, {data: ApplyOrderActionBody;params: ApplyOrderActionParams}> = (props) => {
          const {data,params} = props ?? {};

          return  applyOrderAction(data,params,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type ApplyOrderActionMutationResult = NonNullable<Awaited<ReturnType<typeof applyOrderAction>>>
    export type ApplyOrderActionMutationBody = ApplyOrderActionBody
    export type ApplyOrderActionMutationError = ErrorType<ApplyOrderAction404 | ApplyOrderAction422>

    /**
 * @summary Transition order status via a named action
 */
export const useApplyOrderAction = <TError = ErrorType<ApplyOrderAction404 | ApplyOrderAction422>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof applyOrderAction>>, TError,{data: ApplyOrderActionBody;params: ApplyOrderActionParams}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof applyOrderAction>>,
        TError,
        {data: ApplyOrderActionBody;params: ApplyOrderActionParams},
        TContext
      > => {

      const mutationOptions = getApplyOrderActionMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    