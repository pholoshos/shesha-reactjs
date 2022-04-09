import React, { FC, Fragment } from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { CalendarOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import ConfigurableFormItem from '../formItem';
import settingsFormJson from './settingsForm.json';
import moment, { isMoment } from 'moment';
import { getStyle, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { HiddenFormItem } from '../../../hiddenFormItem';
import { useForm } from '../../../../providers';
import { DataTypes } from '../../../../interfaces/dataTypes';
import ReadOnlyDisplayFormItem from '../../../readOnlyDisplayFormItem';
import { getMoment } from '../../../../utils/date';
import { customDateEventHandler } from '../utils';

const DATE_TIME_FORMATS = {
  time: 'HH:mm',
  week: 'YYYY-wo',
  date: 'DD/MM/YYYY',
  quarter: 'YYYY-\\QQ',
  month: 'YYYY-MM',
  year: 'YYYY',
};

const { RangePicker } = DatePicker;

type RangeType = 'start' | 'end';

interface IRangeInfo {
  range: RangeType;
}

type RangeValue = [moment.Moment, moment.Moment];

type TimePickerChangeEvent = (value: any | null, dateString: string) => void;
type RangePickerChangeEvent = (values: any, formatString: [string, string]) => void;

export interface IDateFieldProps extends IConfigurableFormComponent {
  dateFormat?: string;
  value?: any;
  hideBorder?: boolean;
  showTime?: boolean;
  showNow?: boolean;
  showToday?: boolean;
  timeFormat?: string;
  yearFormat?: string;
  quarterFormat?: string;
  monthFormat?: string;
  weekFormat?: string;
  range?: boolean;
  picker?: 'time' | 'date' | 'week' | 'month' | 'quarter' | 'year';
  disablePastDates?: boolean;
  onChange?: TimePickerChangeEvent | RangePickerChangeEvent;
  disabledDateMode?: 'none' | 'functionTemplate' | 'customFunction';
  disabledDateTemplate?: string;
  disabledDateFunc?: string;
}

const settingsForm = settingsFormJson as FormMarkup;

const DateField: IToolboxComponent<IDateFieldProps> = {
  type: 'dateField',
  name: 'Date field',
  icon: <CalendarOutlined />,
  dataTypeSupported: ({ dataType }) => dataType === DataTypes.date || dataType === DataTypes.dateTime,
  factory: (model: IDateFieldProps, _c, form) => {
    return (
      <Fragment>
        <ConfigurableFormItem model={model}>
          <DatePickerWrapper {...model} {...customDateEventHandler(model, form)} />
        </ConfigurableFormItem>

        {model?.range && (
          <Fragment>
            <HiddenFormItem name={`${model?.name}Start`} />
            <HiddenFormItem name={`${model?.name}End`} />
          </Fragment>
        )}
      </Fragment>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => {
    const customModel: IDateFieldProps = {
      ...model,
      picker: 'date',
      showTime: false,
      dateFormat: DATE_TIME_FORMATS?.date,
      timeFormat: DATE_TIME_FORMATS.time,
    };
    return customModel;
  },
  linkToModelMetadata: (model, metadata): IDateFieldProps => {
    return {
      ...model,
      showTime: metadata.dataType === DataTypes.dateTime,
    };
  },
};

export const DatePickerWrapper: FC<Omit<IDateFieldProps, 'style'>> = props => {
  const {
    name,
    dateFormat = DATE_TIME_FORMATS.date,
    timeFormat = DATE_TIME_FORMATS.time,
    yearFormat = DATE_TIME_FORMATS.year,
    quarterFormat = DATE_TIME_FORMATS.quarter,
    monthFormat = DATE_TIME_FORMATS.month,
    weekFormat = DATE_TIME_FORMATS.week,
    disabled,
    hideBorder,
    range,
    value,
    showTime,
    showNow,
    showToday,
    onChange,
    picker = 'date',
    defaultValue,
    disabledDateMode,
    disabledDateTemplate,
    disabledDateFunc,
    readOnly,
    ...rest
  } = props;
  const { form, formMode, isComponentDisabled, formData } = useForm();

  const isDisabled = isComponentDisabled(rest);

  const isReadOnly = readOnly || formMode === 'readonly';

  const getFormat = () => {
    switch (picker) {
      case 'date':
        return showTime ? `${dateFormat} ${timeFormat}` : dateFormat;
      case 'year':
        return yearFormat;
      case 'month':
        return monthFormat;
      case 'quarter':
        return quarterFormat;
      case 'time':
        return timeFormat;
      case 'week':
        return weekFormat;
      default:
        return dateFormat;
    }
  };

  const pickerFormat = getFormat();

  const formattedValue = getMoment(value, pickerFormat);

  const getDefaultRangePickerValues = () =>
    Array.isArray(defaultValue) && defaultValue?.length === 2
      ? defaultValue?.map(v => moment(new Date(v), pickerFormat))
      : [null, null];

  const handleDatePickerChange = (localValue: any | null, dateString: string) => {
    const newValue = isMoment(localValue) ? localValue.format() : localValue;

    (onChange as TimePickerChangeEvent)(newValue, dateString);
  };

  const handleRangePicker = (values: any[], formatString: [string, string]) => {
    const dates = (values as []).map((val: any) => {
      if (isMoment(val)) return val.format();

      return val;
    });

    (onChange as RangePickerChangeEvent)(dates, formatString);
  };

  const onCalendarChange = (values: any[], _formatString: [string, string], info: IRangeInfo) => {
    if (info?.range === 'end' && form) {
      form.setFieldsValue({
        [`${name}Start`]: values[0]?.toISOString(),
        [`${name}End`]: values[1]?.toISOString(),
      });
    }
  };

  function disabledDate(current) {
    if (disabledDateMode === 'none') return false;

    const disabledTimeExpression = disabledDateMode === 'functionTemplate' ? disabledDateTemplate : disabledDateFunc;

    // tslint:disable-next-line:function-constructor
    const disabledFunc = new Function('current', 'moment', disabledTimeExpression);

    return disabledFunc(current, moment);
  }

  if (isReadOnly) {
    return <ReadOnlyDisplayFormItem value={formattedValue?.toISOString()} disabled={isDisabled} type="datetime" />;
  }

  if (range) {
    return (
      <RangePicker
        disabledDate={disabledDate}
        onCalendarChange={onCalendarChange}
        onChange={handleRangePicker}
        format={pickerFormat}
        defaultValue={getDefaultRangePickerValues() as RangeValue}
        {...rest}
        picker={picker}
        showTime={showTime}
        disabled={isDisabled}
      />
    );
  }

  return (
    <DatePicker
      value={formattedValue}
      disabledDate={disabledDate}
      disabled={isDisabled}
      onChange={handleDatePickerChange}
      bordered={!hideBorder}
      showTime={showTime}
      showNow={showNow}
      showToday={showToday}
      showSecond={false}
      picker={picker}
      format={pickerFormat}
      {...rest}
    />
  );
};

export default DateField;
