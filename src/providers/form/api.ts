import { useMemo } from "react";
import { GetDataError, useGet } from "restful-react";
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

        return {
            url: 'dont-load'
        };
    }, [args.formId]);

    const fetcher = useGet<IAbpWrappedGetEntityResponse<FormConfigurationDto>, IAjaxResponseBase, IGetFormByIdPayload | IGetFormByNamePayload>(
        requestParams.url,
        { queryParams: requestParams.queryParams, lazy: args.lazy }
    );

    const formConfiguration = useMemo<IFormDto>(() => {
        return fetcher?.data?.result
            ? {
                ...fetcher?.data?.result,
                markup: getMarkupFromResponse(fetcher?.data),
            }
            : null;
    }, [args.formId, fetcher?.data]);

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

    /*
    const fetcherByRawId = useGet<IAbpWrappedGetEntityResponse<FormConfigurationDto>, IAjaxResponseBase, IGetFormByIdPayload>(
        `/api/services/Shesha/FormConfiguration/Get`, {
        queryParams: { id: formRawId },
        lazy: !Boolean(formRawId) || args.lazy
    });

    
    const fetcherByFullName = useGet<IAbpWrappedGetEntityResponse<FormConfigurationDto>, IAjaxResponseBase, IGetFormByNamePayload>(
        `/api/services/Shesha/FormConfiguration/GetByName`, {
        queryParams: { module: formFullName?.module, name: formFullName?.name, version: formFullName?.version },
        lazy: !Boolean(formFullName) || args.lazy
    });

    const fetcher = formRawId
        ? fetcherByRawId
        : formFullName
            ? fetcherByFullName
            : null;

    const response = useMemo<IFormMarkupResponse>(() => {
        const formConfiguration = fetcher?.data?.result
            ? {
                ...fetcher?.data?.result,
                markup: getMarkupFromResponse(fetcher?.data),
            }
            : null;
        return null;
    }, []);
    return response;

    //const deps = { formId: args.formId, fetcher, fetcherData: fetcher?.data};
    const formConfiguration = useMemo<IFormDto>(() => {
        //console.log('calculate formConfiguration', deps);

        if (!fetcher?.data?.result)
            return null;

        return {
            ...fetcher?.data?.result,
            markup: getMarkupFromResponse(fetcher?.data),
        };
    }, [args.formId, fetcher, fetcher?.data]);

    const reFetcher = () => {
        console.log('reFetcher called');
        return fetcher?.refetch().then(response => {
            return getMarkupFromResponse(response);
        });
    };

    const result: IFormMarkupResponse = {
        formConfiguration: formConfiguration,
        loading: fetcher?.loading,
        error: fetcher?.error,
        refetch: reFetcher,
    };
    return result;
    */
}