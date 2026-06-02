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
  CreateMenuCategory201,
  CreateMenuCategory400,
  CreateMenuCategoryBody,
  CreateMenuItem201,
  CreateMenuItem400,
  CreateMenuItemBody,
  ListMenuCategories200Item,
  ListMenuCategoriesParams,
  ListMenuItems200Item,
  ListMenuItemsParams,
  UpdateMenuCategory200,
  UpdateMenuCategory404,
  UpdateMenuCategoryBody,
  UpdateMenuCategoryParams,
  UpdateMenuItem200,
  UpdateMenuItem404,
  UpdateMenuItemBody,
  UpdateMenuItemParams
} from '../restaurantAPI.schemas';

import { customInstance } from '../../lib/custom-instance';
import type { ErrorType } from '../../lib/custom-instance';




/**
 * @summary List menu categories for a restaurant
 */
export const listMenuCategories = (
    params: ListMenuCategoriesParams,
 signal?: AbortSignal
) => {
      
      
      return customInstance<ListMenuCategories200Item[]>(
      {url: `/api/menu-categories`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getListMenuCategoriesQueryKey = (params?: ListMenuCategoriesParams,) => {
    return [
    `/api/menu-categories`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getListMenuCategoriesQueryOptions = <TData = Awaited<ReturnType<typeof listMenuCategories>>, TError = ErrorType<unknown>>(params: ListMenuCategoriesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listMenuCategories>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListMenuCategoriesQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof listMenuCategories>>> = ({ signal }) => listMenuCategories(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listMenuCategories>>, TError, TData> & { queryKey: DataTag<QueryKey, TData> }
}

export type ListMenuCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof listMenuCategories>>>
export type ListMenuCategoriesQueryError = ErrorType<unknown>


export function useListMenuCategories<TData = Awaited<ReturnType<typeof listMenuCategories>>, TError = ErrorType<unknown>>(
 params: ListMenuCategoriesParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof listMenuCategories>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listMenuCategories>>,
          TError,
          Awaited<ReturnType<typeof listMenuCategories>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useListMenuCategories<TData = Awaited<ReturnType<typeof listMenuCategories>>, TError = ErrorType<unknown>>(
 params: ListMenuCategoriesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listMenuCategories>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listMenuCategories>>,
          TError,
          Awaited<ReturnType<typeof listMenuCategories>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useListMenuCategories<TData = Awaited<ReturnType<typeof listMenuCategories>>, TError = ErrorType<unknown>>(
 params: ListMenuCategoriesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listMenuCategories>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
/**
 * @summary List menu categories for a restaurant
 */

export function useListMenuCategories<TData = Awaited<ReturnType<typeof listMenuCategories>>, TError = ErrorType<unknown>>(
 params: ListMenuCategoriesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listMenuCategories>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {

  const queryOptions = getListMenuCategoriesQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Create a menu category
 */
export const createMenuCategory = (
    createMenuCategoryBody: CreateMenuCategoryBody,
 signal?: AbortSignal
) => {
      
      
      return customInstance<CreateMenuCategory201>(
      {url: `/api/menu-categories`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createMenuCategoryBody, signal
    },
      );
    }
  


export const getCreateMenuCategoryMutationOptions = <TError = ErrorType<CreateMenuCategory400>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createMenuCategory>>, TError,{data: CreateMenuCategoryBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof createMenuCategory>>, TError,{data: CreateMenuCategoryBody}, TContext> => {

const mutationKey = ['createMenuCategory'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createMenuCategory>>, {data: CreateMenuCategoryBody}> = (props) => {
          const {data} = props ?? {};

          return  createMenuCategory(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type CreateMenuCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof createMenuCategory>>>
    export type CreateMenuCategoryMutationBody = CreateMenuCategoryBody
    export type CreateMenuCategoryMutationError = ErrorType<CreateMenuCategory400>

    /**
 * @summary Create a menu category
 */
export const useCreateMenuCategory = <TError = ErrorType<CreateMenuCategory400>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createMenuCategory>>, TError,{data: CreateMenuCategoryBody}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createMenuCategory>>,
        TError,
        {data: CreateMenuCategoryBody},
        TContext
      > => {

      const mutationOptions = getCreateMenuCategoryMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Update a menu category
 */
export const updateMenuCategory = (
    updateMenuCategoryBody: UpdateMenuCategoryBody,
    params: UpdateMenuCategoryParams,
 ) => {
      
      
      return customInstance<UpdateMenuCategory200>(
      {url: `/api/menu-categories/:id`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateMenuCategoryBody,
        params
    },
      );
    }
  


export const getUpdateMenuCategoryMutationOptions = <TError = ErrorType<UpdateMenuCategory404>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateMenuCategory>>, TError,{data: UpdateMenuCategoryBody;params: UpdateMenuCategoryParams}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof updateMenuCategory>>, TError,{data: UpdateMenuCategoryBody;params: UpdateMenuCategoryParams}, TContext> => {

const mutationKey = ['updateMenuCategory'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateMenuCategory>>, {data: UpdateMenuCategoryBody;params: UpdateMenuCategoryParams}> = (props) => {
          const {data,params} = props ?? {};

          return  updateMenuCategory(data,params,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type UpdateMenuCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof updateMenuCategory>>>
    export type UpdateMenuCategoryMutationBody = UpdateMenuCategoryBody
    export type UpdateMenuCategoryMutationError = ErrorType<UpdateMenuCategory404>

    /**
 * @summary Update a menu category
 */
export const useUpdateMenuCategory = <TError = ErrorType<UpdateMenuCategory404>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateMenuCategory>>, TError,{data: UpdateMenuCategoryBody;params: UpdateMenuCategoryParams}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateMenuCategory>>,
        TError,
        {data: UpdateMenuCategoryBody;params: UpdateMenuCategoryParams},
        TContext
      > => {

      const mutationOptions = getUpdateMenuCategoryMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary List menu items for a restaurant
 */
export const listMenuItems = (
    params: ListMenuItemsParams,
 signal?: AbortSignal
) => {
      
      
      return customInstance<ListMenuItems200Item[]>(
      {url: `/api/menu-items`, method: 'GET',
        params, signal
    },
      );
    }
  



export const getListMenuItemsQueryKey = (params?: ListMenuItemsParams,) => {
    return [
    `/api/menu-items`, ...(params ? [params]: [])
    ] as const;
    }

    
export const getListMenuItemsQueryOptions = <TData = Awaited<ReturnType<typeof listMenuItems>>, TError = ErrorType<unknown>>(params: ListMenuItemsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listMenuItems>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getListMenuItemsQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof listMenuItems>>> = ({ signal }) => listMenuItems(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof listMenuItems>>, TError, TData> & { queryKey: DataTag<QueryKey, TData> }
}

export type ListMenuItemsQueryResult = NonNullable<Awaited<ReturnType<typeof listMenuItems>>>
export type ListMenuItemsQueryError = ErrorType<unknown>


export function useListMenuItems<TData = Awaited<ReturnType<typeof listMenuItems>>, TError = ErrorType<unknown>>(
 params: ListMenuItemsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof listMenuItems>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof listMenuItems>>,
          TError,
          Awaited<ReturnType<typeof listMenuItems>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useListMenuItems<TData = Awaited<ReturnType<typeof listMenuItems>>, TError = ErrorType<unknown>>(
 params: ListMenuItemsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listMenuItems>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof listMenuItems>>,
          TError,
          Awaited<ReturnType<typeof listMenuItems>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
export function useListMenuItems<TData = Awaited<ReturnType<typeof listMenuItems>>, TError = ErrorType<unknown>>(
 params: ListMenuItemsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listMenuItems>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> }
/**
 * @summary List menu items for a restaurant
 */

export function useListMenuItems<TData = Awaited<ReturnType<typeof listMenuItems>>, TError = ErrorType<unknown>>(
 params: ListMenuItemsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof listMenuItems>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {

  const queryOptions = getListMenuItemsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}




/**
 * @summary Create a menu item
 */
export const createMenuItem = (
    createMenuItemBody: CreateMenuItemBody,
 signal?: AbortSignal
) => {
      
      
      return customInstance<CreateMenuItem201>(
      {url: `/api/menu-items`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createMenuItemBody, signal
    },
      );
    }
  


export const getCreateMenuItemMutationOptions = <TError = ErrorType<CreateMenuItem400>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createMenuItem>>, TError,{data: CreateMenuItemBody}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof createMenuItem>>, TError,{data: CreateMenuItemBody}, TContext> => {

const mutationKey = ['createMenuItem'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createMenuItem>>, {data: CreateMenuItemBody}> = (props) => {
          const {data} = props ?? {};

          return  createMenuItem(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type CreateMenuItemMutationResult = NonNullable<Awaited<ReturnType<typeof createMenuItem>>>
    export type CreateMenuItemMutationBody = CreateMenuItemBody
    export type CreateMenuItemMutationError = ErrorType<CreateMenuItem400>

    /**
 * @summary Create a menu item
 */
export const useCreateMenuItem = <TError = ErrorType<CreateMenuItem400>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createMenuItem>>, TError,{data: CreateMenuItemBody}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createMenuItem>>,
        TError,
        {data: CreateMenuItemBody},
        TContext
      > => {

      const mutationOptions = getCreateMenuItemMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    /**
 * @summary Update a menu item (name, price, availability, etc.)
 */
export const updateMenuItem = (
    updateMenuItemBody: UpdateMenuItemBody,
    params: UpdateMenuItemParams,
 ) => {
      
      
      return customInstance<UpdateMenuItem200>(
      {url: `/api/menu-items/:id`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateMenuItemBody,
        params
    },
      );
    }
  


export const getUpdateMenuItemMutationOptions = <TError = ErrorType<UpdateMenuItem404>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateMenuItem>>, TError,{data: UpdateMenuItemBody;params: UpdateMenuItemParams}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof updateMenuItem>>, TError,{data: UpdateMenuItemBody;params: UpdateMenuItemParams}, TContext> => {

const mutationKey = ['updateMenuItem'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateMenuItem>>, {data: UpdateMenuItemBody;params: UpdateMenuItemParams}> = (props) => {
          const {data,params} = props ?? {};

          return  updateMenuItem(data,params,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type UpdateMenuItemMutationResult = NonNullable<Awaited<ReturnType<typeof updateMenuItem>>>
    export type UpdateMenuItemMutationBody = UpdateMenuItemBody
    export type UpdateMenuItemMutationError = ErrorType<UpdateMenuItem404>

    /**
 * @summary Update a menu item (name, price, availability, etc.)
 */
export const useUpdateMenuItem = <TError = ErrorType<UpdateMenuItem404>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateMenuItem>>, TError,{data: UpdateMenuItemBody;params: UpdateMenuItemParams}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateMenuItem>>,
        TError,
        {data: UpdateMenuItemBody;params: UpdateMenuItemParams},
        TContext
      > => {

      const mutationOptions = getUpdateMenuItemMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
    