import { useMemo } from "react";
import { useGet } from "restful-react";
import { GENERIC_ENTITIES_ENDPOINT } from "../constants";
import { IAbpWrappedGetEntityListResponse, IGetAllPayload } from "../interfaces/gql";
import { camelcaseDotNotation } from "../providers/form/utils";

export interface IUseEntityDisplayTextProps {
    entityType?: string;
    propertyName?: string;
    entityId?: string | string[];
}

interface IGetEntityPayload extends IGetAllPayload {
    entityType: string;
}

const buildFilterById = (value: string | string[]): string => {
    if (!value) return null;

    const ids = Array.isArray(value) ? value : [value];
    const expression = { in: [{ var: 'Id' }, ids] };
    return JSON.stringify(expression);
};

const normalizePropertyName = (propName: string): string => {
    return !propName || propName.startsWith('_')
        ? propName
        : camelcaseDotNotation(propName);
}

export const useEntityDisplayText = (props: IUseEntityDisplayTextProps): string => {
    const { entityType, propertyName, entityId } = props;

    const displayProperty = normalizePropertyName(propertyName) ?? '_displayName';

    const getValuePayload: IGetEntityPayload = {
        skipCount: 0,
        maxResultCount: 1000,
        entityType: entityType,
        properties: displayProperty,
        filter: buildFilterById(entityId),
    };
    const valueFetcher = useGet<IAbpWrappedGetEntityListResponse, any, IGetEntityPayload>(
        `${GENERIC_ENTITIES_ENDPOINT}/GetAll`,
        {
            lazy: !entityId,
            queryParams: getValuePayload,
        }
    );

    const valueItems = valueFetcher.data?.result?.items;
    const result = useMemo<string>(() => {
        if (!entityType || !propertyName || !entityId)
            return null;
        if (!valueItems || valueItems.length === 0)
            return null;

        const result = valueItems?.map(ent => ent[normalizePropertyName(propertyName)] ?? 'unknown').join(',');
        return result;
    }, [entityType, propertyName, entityId, valueItems]);
    return result;
};