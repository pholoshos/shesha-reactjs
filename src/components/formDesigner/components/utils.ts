import { FormInstance } from 'antd';
import { DOMAttributes } from 'react';
import { IConfigurableFormComponent } from '../../..';
import { CustomLabeledValue } from '../../autocomplete';

export const onCustomEventsHandler = <FormCustomEvent = any>(
  event: FormCustomEvent,
  customEventAction: string,
  form: FormInstance
) => {
  /* tslint:disable:function-constructor */
  const eventFunc = new Function('event', 'form', customEventAction);

  return eventFunc(event, form);
};

export const customEventHandler = <T = any>(
  model: IConfigurableFormComponent,
  form: FormInstance
): DOMAttributes<T> => ({
  onBlur: event => onCustomEventsHandler(event, model?.onBlurCustom, form),
  onChange: event => onCustomEventsHandler(event, model?.onChangeCustom, form),
  onFocus: event => onCustomEventsHandler(event, model?.onFocusCustom, form),
});

export const customDateEventHandler = (model: IConfigurableFormComponent, form: FormInstance) => ({
  onChange: (value: any | null, dateString: string | [string, string]) => {
    const eventFunc = new Function('value', 'dateString', 'form', model?.onChangeCustom);
    return eventFunc(value, dateString, form);
  },
});

export const customDropDownEventHandler = <T = any>(model: IConfigurableFormComponent, form: FormInstance) => ({
  onChange: (value: CustomLabeledValue<T>, option: any) => {
    const eventFunc = new Function('value', 'option', 'form', model?.onChangeCustom);
    return eventFunc(value, option, form);
  },
});

export const customInputNumberEventHandler = (model: IConfigurableFormComponent, form: FormInstance) => ({
  onChange: (value: any) => {
    const eventFunc = new Function('value', 'form', model?.onChangeCustom);
    return eventFunc(value, form);
  },
});
