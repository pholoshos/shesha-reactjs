import { Button } from 'antd';
import React, { FC, useState } from 'react';
import { JsonLogicResult } from 'react-awesome-query-builder';
import { IProperty } from '../../../../providers/queryBuilder/models';
import QueryBuilder from '../../../queryBuilder';

export interface IQueryBuilderPlainProps {
  useExpression?: boolean;
  fields: IProperty[];
  value?: object;
  onChange?: (value: any) => void;
}

export const QueryBuilderPlain: FC<IQueryBuilderPlainProps> = props => {
  const [jsonLogicResult, setJsonLogicResult] = useState<JsonLogicResult>(undefined);

  const onOkClick = () => {
    if (jsonLogicResult) {
      if (jsonLogicResult && jsonLogicResult.errors && jsonLogicResult.errors.length > 0) {
        console.log(jsonLogicResult);
        // show errors
        return;
      }

      if (props.onChange) {
        props.onChange(jsonLogicResult?.logic);
      }
    }
  };

  const onChange = (result: JsonLogicResult) => {
    setJsonLogicResult(result);
  };

  return (
    <div>
      <div>
        <Button onClick={onOkClick} type="primary">
          Save filters
        </Button>
      </div>

      <QueryBuilder
        value={props.value}
        onChange={onChange}
        fields={props.fields}
        useExpression={props?.useExpression}
      />
    </div>
  );
};

export default QueryBuilderPlain;
