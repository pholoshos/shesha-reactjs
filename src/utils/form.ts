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

export const getFormFullName = (moduleName: string, name: string) => {
  return moduleName
    ? `${moduleName}/${name}`
    : name;
}

export const appendFormData = (formData: FormData, key: string, data: any) => {
  if (data === Object(data) || Array.isArray(data)) {
      for (var i in data) {
        appendFormData(formData, key + '[' + i + ']', data[i]);
      }
  } else {
      formData.append(key, data);
  }
}