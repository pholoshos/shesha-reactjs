import React, { FC } from 'react';
import { IConfigurableFormComponent } from '../../../providers/form/models';
import { ColProps, Form } from 'antd';
import { useForm } from '../../../providers/form';
import { getFieldNameFromExpression, getValidationRules } from '../../../providers/form/utils';
import classNames from 'classnames';
import './styles.less';

export interface IConfigurableFormItemProps {
  model: IConfigurableFormComponent;
  readonly children?: React.ReactNode;
  className?: string;
  valuePropName?: string;
  initialValue?: any;
  // tslint:disable-next-line:jsdoc-format
  /** Custom visibility code
   * available variables:
   * value - value of the current component
   * data - entire form data
   * moment - instance of the moment.js
   */
  customVisibility?: string;
  wrapperCol?: ColProps;
  labelCol?: ColProps;
}

const ConfigurableFormItem: FC<IConfigurableFormItemProps> = ({
  children,
  model,
  valuePropName,
  className,
  labelCol,
  wrapperCol,
}) => {
  const { isComponentHidden } = useForm();

  const isHidden = isComponentHidden(model);

  const style = model?.hidden ? { display: 'none' } : {};

  return (
    <Form.Item
      className={classNames(className, { 'form-item-hidden': model.hideLabel })}
      name={getFieldNameFromExpression(model.name)}
      label={model.hideLabel ? null : model.label}
      labelAlign={model.labelAlign}
      hidden={isHidden}
      valuePropName={valuePropName}
      tooltip={model.description}
      rules={isHidden ? [] : getValidationRules(model)}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      style={style}
    >
      {children}
    </Form.Item>
  );
};

export default ConfigurableFormItem;
