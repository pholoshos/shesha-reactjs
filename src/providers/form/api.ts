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

export interface IUseFormMarkupProps {
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

interface IGetFormPayload {
    module?: string;
    name?: string;
    version?: number;
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
export const useFormConfiguration = (props: IUseFormMarkupProps): IFormMarkupResponse => {
    const fetcher = useGet<IAbpWrappedGetEntityResponse<FormConfigurationDto>, IAjaxResponseBase, IGetFormPayload>(
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