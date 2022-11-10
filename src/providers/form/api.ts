import { useEffect, useMemo } from "react";
import { GetDataError, useGet } from "restful-react";
import { useAppConfigurator } from "../..";
import { IAjaxResponseBase } from "../../interfaces/ajaxResponse";
import { IAbpWrappedGetEntityResponse } from "../../interfaces/gql";
import { FormIdentifier, FormMarkupWithSettings, IFormDto } from "./models";
import { asFormFullName, asFormRawId } from "./utils";

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
    /**
     * Version status
     */
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
export type UseFormConfigurationArgs = {
    formId: FormIdentifier;
} & IFormFetcherProps;

export interface IUseFormConfigurationProps {
    id?: string;
    module?: string;
    name: string;
    version?: number;
    lazy: boolean;
}

export type FormProperties = Omit<FormConfigurationDto, 'markup'>;

export interface IFormMarkupResponse {
    requestParams: any;
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

    const { configurationItemMode } = useAppConfigurator();

    const requestParams = useMemo(() => {
        const formRawId = asFormRawId(args.formId);
        const formFullName = asFormFullName(args.formId);

        if (formRawId)
            return {
                url: '/api/services/Shesha/FormConfiguration/Get',
                queryParams: { id: formRawId }
            };

        if (formFullName)
            return {
                url: '/api/services/Shesha/FormConfiguration/GetByName',
                queryParams: { name: formFullName.name, module: formFullName.module, version: formFullName.version }
            };

        return null;
    }, [args.formId, configurationItemMode]);

    const canFetch = Boolean(requestParams && requestParams.url);
    const fetcher = useGet<IAbpWrappedGetEntityResponse<FormConfigurationDto>, IAjaxResponseBase, IGetFormByIdPayload | IGetFormByNamePayload>(
        requestParams?.url ?? '',
        { queryParams: requestParams?.queryParams, lazy: !args.lazy || !canFetch }
    );

    useEffect(() => {
        if (fetcher.data && canFetch)
            reFetcher();
    }, [configurationItemMode]);

    const formConfiguration = useMemo<IFormDto>(() => {
        if (fetcher?.data?.result) {
            const markupWithSettings = getMarkupFromResponse(fetcher?.data);
            return {
                ...fetcher?.data?.result,
                markup: markupWithSettings?.components,
                settings: markupWithSettings?.formSettings
            };
        } else
            return null;
    }, [args.formId, fetcher?.data]);

    const reFetch = () => {
        return fetcher.refetch({ path: requestParams.url, queryParams: requestParams.queryParams });
    }

    const reFetcher = () => {
        return canFetch
            ? reFetch().then(response => {
                return getMarkupFromResponse(response);
            })
            : Promise.reject('Can`t fetch form due to internal state');
    };

    const result: IFormMarkupResponse = {
        formConfiguration: formConfiguration,
        loading: fetcher.loading,
        error: fetcher.error,
        refetch: reFetcher,
        requestParams: requestParams
    };
    return result;
}