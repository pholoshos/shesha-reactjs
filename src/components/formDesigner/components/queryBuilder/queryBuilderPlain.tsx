import { Button, message } from 'antd';
import React, { FC, useState } from 'react';
import { JsonLogicResult } from 'react-awesome-query-builder';
import { IProperty } from '../../../../providers/queryBuilder/models';
import QueryBuilder from '../../../queryBuilder';
import './styles/queryBuilderPlain.less';

export interface IQueryBuilderPlainProps {
  useExpression?: boolean;
  fields: IProperty[];
  value?: object;
  onChange?: (value: any) => void;
}

export const QueryBuilderPlain: FC<IQueryBuilderPlainProps> = ({ value, fields, useExpression, onChange }) => {
  const [jsonLogicResult, setJsonLogicResult] = useState<JsonLogicResult>(undefined);

  const onOkClick = () => {
    if (jsonLogicResult) {
      if (jsonLogicResult && jsonLogicResult.errors && jsonLogicResult.errors.length > 0) {
        console.log(jsonLogicResult);
        // show errors
        return;
      }

      if (onChange) {
        onChange(jsonLogicResult?.logic);
        message.success('Query saved locally!');
      }
    }
  };

  const handleChange = (result: JsonLogicResult) => {
    setJsonLogicResult(result);
  };

  return (
    <div className="sha-query-builder-plain-wrapper">
      <QueryBuilder value={value} onChange={handleChange} fields={fields} useExpression={useExpression} />

      <div className="sha-query-builder-plain-wrapper-btn-wrapper">
        <Button onClick={onOkClick} size="small" type="primary" disabled={!jsonLogicResult}>
          Save filters
        </Button>
      </div>
    </div>
  );
};

export default QueryBuilderPlain;
