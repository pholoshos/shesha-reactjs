import { FC } from "react";
import { IProperty } from "../../../../providers/queryBuilder/models";

export interface IQueryBuilderProps {
    jsonExpanded?: boolean;
    modelType?: string;
    fieldsUnavailableHint?: string;
    useExpression?: string | boolean;
    value?: object;
    onChange?: (value: Object) => void;
  }

  export interface IQueryBuilderFieldProps {
    jsonExpanded?: boolean;
    useExpression?: boolean;
    fields: IProperty[];
    fetchFields: (fieldNames: string[]) => void;
    value?: object;
    onChange?: (value: any) => void;
  }

  export type QueryBuilderFieldType = FC<IQueryBuilderFieldProps>;