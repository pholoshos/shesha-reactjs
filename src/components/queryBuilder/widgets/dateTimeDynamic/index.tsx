import { BaseWidget, BasicConfig, SelectFieldSettings, WidgetProps } from 'react-awesome-query-builder';
import React, { FC } from 'react';
import { Input, Row, Col } from 'antd';

export type DateTimeDynamicWidgetType = BaseWidget & SelectFieldSettings;

const DateTimeDynamicWidget: DateTimeDynamicWidgetType = {
  ...BasicConfig.widgets.select,
  jsType: 'string',
  type: 'dateTimeDynamic',
  factory: props => <Widget {...props} />,
};

const Widget: FC<React.Attributes & WidgetProps> = props => {
  const { config, value, setValue, isSpecialRange, valuePlaceholder, placeholders, readonly, maxLength } = props as any;

  const { renderSize } = config.settings;

  let startVal = '';
  let endVal = '';

  if (Array.isArray(value)) {
    startVal = value[0];

    if (value?.length === 2) {
      endVal = value[1];
    }
  }

  const onChange = (v: string | string[]) => {
    setValue(v);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  const handleStartValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange([event?.target?.value, endVal]);
  };

  const handleEndValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange([startVal, event?.target?.value]);
  };

  if (isSpecialRange) {
    let placeholderStart = '';
    let placeholderEnd = '';

    if (Array.isArray(placeholders) && placeholders?.length === 2) {
      placeholderStart = placeholders[0];
      placeholderEnd = placeholders[1];
    }
    return (
      <Input.Group size={renderSize}>
        <Row gutter={8}>
          <Col span={11}>
            <Input
              type={'text'}
              value={startVal}
              onChange={handleStartValue}
              size={renderSize}
              placeholder={placeholderStart}
              maxLength={maxLength}
              key="widget-text"
            />
          </Col>

          <Col>
            <span>and</span>
          </Col>

          <Col span={11}>
            <Input
              type={'text'}
              value={endVal}
              onChange={handleEndValue}
              size={renderSize}
              placeholder={placeholderEnd}
              disabled={readonly}
              maxLength={maxLength}
              key="widget-text"
            />
          </Col>
        </Row>
      </Input.Group>
    );
  }

  return (
    <Input
      onChange={handleChange}
      value={typeof value === 'string' ? value : null}
      size={renderSize}
      placeholder={valuePlaceholder}
      disabled={readonly}
      maxLength={maxLength}
      key="widget-text"
    />
  );
};

export default DateTimeDynamicWidget;
