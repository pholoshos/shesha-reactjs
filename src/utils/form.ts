import { FormInstance } from 'antd';

interface IDataWithFields {
  _formFields: string[];
  [key: string]: any;
}

export function addFormFieldsList<TData = any>(data: TData, form: FormInstance): IDataWithFields {
  const formFields = [];

  // call getFieldsValue to get a fileds list
  form.getFieldsValue(true, meta => {
    formFields.push(meta.name.join('.'));

    return false;
  });

  return { _formFields: formFields, ...data };
}
