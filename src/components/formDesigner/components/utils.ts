import { FormInstance } from 'antd';
import { DOMAttributes } from 'react';
import { IConfigurableFormComponent } from '../../..';
import { RangePickerSharedProps } from 'rc-picker/lib/RangePicker';

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

export const customDateEventHandler = <T = any>(
  model: IConfigurableFormComponent,
  form: FormInstance
): RangePickerSharedProps<T> => ({
  onChange: (value, dateString) => {
    const eventFunc = new Function('value', 'dateString', 'form', model?.onChangeCustom);
    return eventFunc(value, dateString, form);
  },
});
