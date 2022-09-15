import { useMemo } from "react";
import { GetDataError, useGet } from "restful-react";
import { IAjaxResponseBase } from "../../interfaces/ajaxResponse";
import { IAbpWrappedGetEntityResponse } from "../../interfaces/gql";
import { FormMarkupWithSettings, IFormDto } from "./models";

/**
 * Form configuration DTO
 */
export interface FormConfigurationDto {
    id?: string;
    /**
     * Form path/id is used to identify a form
     */
    moduleId?: string | null;
    /**
     * Form name
     */
    name?: string | null;
    /**
     * Label
     */
    label?: string | null;
    /**
     * Description
     */
    description?: string | null;
    /**
     * Markup in JSON format
     */
    markup?: string | null;
    /**
     * Type of the form model
     */
    modelType?: string | null;
    /**
     * Version number
     */
    versionNo?: number;
    versionStatus?: number;
}

export interface IFormFetcherProps {
    lazy: boolean;
}
export interface IFormByIdProps {
    id: string;
}
export interface IFormByNameProps {
    module?: string;
    name: string;
    version?: number;
}
export type UseFormConfigurationByIdArgs = IFormByIdProps & IFormFetcherProps;
export type UseFormConfigurationByNameArgs = IFormByNameProps & IFormFetcherProps;
export type UseFormConfigurationArgs = UseFormConfigurationByIdArgs | UseFormConfigurationByNameArgs;

export interface IUseFormConfigurationProps {
    id?: string;
    module?: string;
    name: string;
    version?: number;
    lazy: boolean;
}

export type FormProperties = Omit<FormConfigurationDto, 'markup'>;

export interface IFormMarkupResponse {
    formConfiguration: IFormDto;
    loading: boolean;
    error: GetDataError<IAjaxResponseBase>;
    refetch: () => Promise<FormMarkupWithSettings>;
}

interface IGetFormByNamePayload {
    module?: string;
    name: string;
    version?: number;
}

interface IGetFormByIdPayload {
    id: string;
}

const getMarkupFromResponse = (data: IAbpWrappedGetEntityResponse<FormConfigurationDto>): FormMarkupWithSettings => {
    const markupJson = data?.result?.markup;
    return markupJson
        ? JSON.parse(markupJson) as FormMarkupWithSettings
        : null;
}

/**
 * Load form markup from the back-end
 */
export const useFormConfiguration = (args: UseFormConfigurationArgs): IFormMarkupResponse => {
    const argsByName = args as UseFormConfigurationByNameArgs;
    if (argsByName.name)
        return useFormConfigurationByName(argsByName);

    const argsById = args as UseFormConfigurationByIdArgs;
    if (argsById.id)
        return useFormConfigurationById(argsById);

    return {
        formConfiguration: null,
        loading: false,
        error: null,
        refetch: () => {
            console.log('try to fetch')
            return null;
        }
    };
}

const useFormConfigurationById = (props: UseFormConfigurationByIdArgs): IFormMarkupResponse => {
    const fetcher = useGet<IAbpWrappedGetEntityResponse<FormConfigurationDto>, IAjaxResponseBase, IGetFormByIdPayload>(
        `/api/services/Shesha/FormConfiguration/Get`, { queryParams: { id: props.id }, lazy: props.lazy });

    const formConfiguration = useMemo<IFormDto>(() => {
        if (!fetcher.data?.result)
            return null;
        
        return {
            ...fetcher.data?.result, 
            markup: getMarkupFromResponse(fetcher.data),
        };
    }, [props.id, fetcher.data]);

    const reFetcher = () => {
        console.log('try to fetch by id')
        return fetcher.refetch().then(response => {
            return getMarkupFromResponse(response);
        });
    };

    const result: IFormMarkupResponse = {
        formConfiguration: formConfiguration,
        loading: fetcher.loading,
        error: fetcher.error,
        refetch: reFetcher,
    };
    return result;
}

const useFormConfigurationByName = (props: UseFormConfigurationByNameArgs): IFormMarkupResponse => {
    const fetcher = useGet<IAbpWrappedGetEntityResponse<FormConfigurationDto>, IAjaxResponseBase, IGetFormByNamePayload>(
        `/api/services/Shesha/FormConfiguration/GetByName`, { queryParams: { module: props.module, name: props.name, version: props.version }, lazy: props.lazy });

    const formConfiguration = useMemo<IFormDto>(() => {
        if (!fetcher.data?.result)
            return null;
        
        return {
            ...fetcher.data?.result, 
            markup: getMarkupFromResponse(fetcher.data),
        };
    }, [props.module, props.name, props.version, fetcher.data]);

    const reFetcher = () => {
        console.log('try to fetch by name')
        return fetcher.refetch().then(response => {
            return getMarkupFromResponse(response);
        });
    };

    const result: IFormMarkupResponse = {
        formConfiguration: formConfiguration,
        loading: fetcher.loading,
        error: fetcher.error,
        refetch: reFetcher,
    };
    return result;
}