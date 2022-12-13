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

const buildFormData = (formData, data, parentKey) => {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach(key => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value = data == null ? '' : data;

    formData.append(parentKey, value);
  }
}

export const jsonToFormData = (data: any): FormData => {
  const formData = new FormData();
  
  buildFormData(formData, data, undefined);
  
  return formData;
}

export const hasFiles = (data: any): boolean => {
  if (typeof data !== 'object')
    return false;
  
  const file = Object.keys(data).find(key => {
    return data[key] instanceof File || hasFiles(data[key]);
  });

  return Boolean(file);
}