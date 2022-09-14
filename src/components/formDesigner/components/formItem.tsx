import React, { FC, useMemo } from 'react';
import { IConfigurableFormComponent } from '../../../providers/form/models';
import { ColProps, Form } from 'antd';
import { useForm } from '../../../providers/form';
import { getFieldNameFromExpression, getValidationRules } from '../../../providers/form/utils';
import classNames from 'classnames';
import './styles.less';
import { useFormItem } from '../../../providers';

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
  initialValue,
  className,
  labelCol,
  wrapperCol,
}) => {
  const { isComponentHidden, formData } = useForm();

  const formItem = useFormItem();

  const { namePrefix, wrapperCol: _wrapperCol, labelCol: _labelCol } = formItem;

  const isHidden = isComponentHidden(model);

  const style = model?.hidden ? { display: 'none' } : {};

  const layout = useMemo(() => {
    // Make sure the `wrapperCol` and `labelCol` from `FormItemProver` override the ones from the main form
    return { labelCol: _labelCol || labelCol, wrapperCol: _wrapperCol || wrapperCol };
  }, [formItem]);

  const getPropName = () => {
    const name = getFieldNameFromExpression(model.name);

    if (namePrefix) {
      return typeof name === 'string' ? [namePrefix, name] : [namePrefix, ...name];
    }

    return name;
  };

  return (
    <Form.Item
      className={classNames(className, { 'form-item-hidden': model.hideLabel })}
      name={getPropName()}
      // name={getFieldNameFromExpression(model.name)}
      label={model.hideLabel ? null : model.label}
      labelAlign={model.labelAlign}
      hidden={isHidden}
      valuePropName={valuePropName}
      initialValue={initialValue}
      tooltip={model.description}
      rules={isHidden ? [] : getValidationRules(model, { formData })}
      labelCol={layout?.labelCol}
      wrapperCol={layout?.wrapperCol}
      style={style}
    >
      {children}
    </Form.Item>
  );
};

export default ConfigurableFormItem;
