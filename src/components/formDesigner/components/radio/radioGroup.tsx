import { Radio, Space } from 'antd';
import React, { FC, useEffect, useMemo } from 'react';
import { useGet } from 'restful-react';
import { useGlobalState } from '../../../../providers';
import { useForm } from '../../../../providers/form';
import { useReferenceList } from '../../../../providers/referenceListDispatcher';
import ReadOnlyDisplayFormItem from '../../../readOnlyDisplayFormItem';
import { getDataSourceList, IRadioProps } from './utils';

const RadioGroup: FC<IRadioProps> = model => {
  const { formData } = useForm();
  const { globalState } = useGlobalState();
  const { referenceListName, referenceListNamespace, items = [], value, onChange } = model;

  const getEvaluatedUrl = (url: string) => {
    if (!url) return '';
    return (() => {
      // tslint:disable-next-line:function-constructor
      return new Function('data, globalState', url)(formData, globalState); // Pass data, query, globalState
    })();
  };

  const { refetch, data } = useGet({ path: getEvaluatedUrl(model?.dataSourceUrl) });

  useEffect(() => {
    if (model?.dataSourceType === 'referenceList') {
      refetch();
    }
  }, [model?.dataSourceType, model?.dataSourceUrl]);

  const reducedData = useMemo(() => {
    if (model?.reducerFunc) {
      return new Function('data', model?.reducerFunc)(data?.result) as [];
    }

    return data?.result;
  }, [data?.result, model?.reducerFunc]);

  const { data: refListItems } = useReferenceList(referenceListNamespace, referenceListName);

  const { formMode, isComponentDisabled } = useForm();

  const options = getDataSourceList(model?.dataSourceType, items, refListItems?.items, reducedData);

  const isReadOnly = model?.readOnly || formMode === 'readonly';

  const disabled = isComponentDisabled(model);

  const renderCheckGroup = () => (
    <Radio.Group disabled={disabled} value={value} onChange={onChange} style={model?.style}>
      <Space direction={model?.direction}>
        {options?.map((checkItem, index) => (
          <Radio key={index} value={checkItem.value}>
            {checkItem.label}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  );

  if (isReadOnly) {
    return <ReadOnlyDisplayFormItem type="radiogroup" disabled={disabled} render={renderCheckGroup} />;
  }

  return renderCheckGroup();
};

export default RadioGroup;
