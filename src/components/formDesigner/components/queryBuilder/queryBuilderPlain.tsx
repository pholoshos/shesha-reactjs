import React, { FC } from 'react';
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
  // const [jsonLogicResult, setJsonLogicResult] = useState<JsonLogicResult>(undefined);

  // useEffect(() => {
  //   onOkClick();
  // }, [jsonLogicResult.logic]);

  // const onOkClick = () => {
  //   if (jsonLogicResult) {
  //     if (jsonLogicResult && jsonLogicResult.errors && jsonLogicResult.errors.length > 0) {
  //       console.log(jsonLogicResult);
  //       // show errors
  //       return;
  //     }

  //     if (onChange) {
  //       onChange(jsonLogicResult?.logic);
  //     }
  //   }
  // };

  const handleChange = (jsonLogicResult: JsonLogicResult) => {
    if (jsonLogicResult) {
      if (jsonLogicResult && jsonLogicResult.errors && jsonLogicResult.errors.length > 0) {
        console.log(jsonLogicResult);
        // show errors
        return;
      }

      if (onChange) {
        onChange(jsonLogicResult?.logic);
      }
    }
  };

  return (
    <div className="sha-query-builder-plain-wrapper">
      <QueryBuilder value={value} onChange={handleChange} fields={fields} useExpression={useExpression} />
    </div>
  );
};

export default QueryBuilderPlain;
