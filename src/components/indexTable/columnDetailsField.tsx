import React, { FC, Fragment } from 'react';
import { IndexColumnDataType } from '../../providers/dataTable/interfaces';
import { renderers } from './columnRenderers';

interface IColumnEditFieldProps {
  dataType: IndexColumnDataType;
  value?: any;
}

export const ColumnDetailsField: FC<IColumnEditFieldProps> = ({ dataType = 'string', value }) => {
  const columnRender = renderers?.find(({ key }) => key === dataType)?.render;

  if (columnRender) {
    return <Fragment>{columnRender({ value }, null)}</Fragment>;
  }

  return <Fragment />;
};

export default ColumnDetailsField;
