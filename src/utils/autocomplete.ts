import { useGet } from "restful-react";
import { IAbpWrappedGetEntityListResponse, EntityData, IGetAllPayload, IAbpWrappedGetEntityResponse } from "../interfaces/gql";

interface AutocompleteReturn {
    data: EntityData[];
    error: any;
    search: (term: string) => void;
    loading: boolean;
}

interface IAutocompletePayload extends IGetAllPayload {
    entityType: string;
}

interface IGetEntityPayload {
    entityType: string;
    id: string;
    readonly properties: string;
}

export interface IAutocompleteProps {
    entityType: string;
    maxResultCount?: number;
    displayProperty?: string;
    value?: string;
}

const GENERIC_ENTITIES_ENDPOINT = "/api/services/app/Entities";

/**
 * Generic entities autocomplete
 */
export const useEntityAutocomplete = (props: IAutocompleteProps): AutocompleteReturn => {
    const displayProperty = props.displayProperty ?? "_displayName";
    const properties = `id ${displayProperty}`;
    const getListFetcherQueryParams = (term: string): IAutocompletePayload => {

        return {
            skipCount: 0,
            maxResultCount: props.maxResultCount ?? 10,
            entityType: props.entityType,
            properties: properties,
            quickSearch: term,
        };
    }

    // current value can be already loaded as part of list! check it and skip fetching

    const preselectedFetcher = useGet<IAbpWrappedGetEntityResponse, any, IGetEntityPayload>(`${GENERIC_ENTITIES_ENDPOINT}/Get`, { lazy: !props.value, queryParams: { entityType: props.entityType, id: props.value, properties } });

    const listFetcher = useGet<IAbpWrappedGetEntityListResponse, any, IAutocompletePayload>(`${GENERIC_ENTITIES_ENDPOINT}/GetAll`, { lazy: true, queryParams: getListFetcherQueryParams(null) });

    const search = (term: string) => {
        listFetcher.refetch({ queryParams: getListFetcherQueryParams(term) });
    }

    const items = listFetcher.data?.result?.items ?? (props.value && preselectedFetcher.data?.result ? [preselectedFetcher.data.result] : []);

    return {
        data: items,
        error: listFetcher.error,
        search,
        loading: listFetcher.loading || preselectedFetcher.loading,
    };
}