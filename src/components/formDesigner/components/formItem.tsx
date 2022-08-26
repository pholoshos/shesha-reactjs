import React, { FC } from 'react';
import { IConfigurableFormComponent } from '../../../providers/form/models';
import { ColProps, Form } from 'antd';
import { useForm } from '../../../providers/form';
import { getFieldNameFromExpression, getValidationRules } from '../../../providers/form/utils';
import classNames from 'classnames';
import './styles.less';
import { useListItemIndex, useSubForm } from '../../../providers';

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

  const { index, layout: listItemLayout } = useListItemIndex();
  const { prefixName, layout: subFormLayout } = useSubForm();

  const isHidden = isComponentHidden(model);

  const style = model?.hidden ? { display: 'none' } : {};

  const getLayout = () => {
    if (listItemLayout?.labelCol?.span || listItemLayout?.wrapperCol?.span) {
      return listItemLayout;
    } else if (subFormLayout?.labelCol?.span || subFormLayout?.wrapperCol?.span) {
      return subFormLayout;
    }
    return { labelCol, wrapperCol };
  };

  const getPropName = () => {
    const name = getFieldNameFromExpression(model.name);

    if (!isNaN(index)) {
      return typeof name === 'string' ? [index, name] : [index, ...name];
    } else if (prefixName) {
      return typeof name === 'string' ? [prefixName, name] : [prefixName, ...name];
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
      {...getLayout()}
      style={style}
    >
      {children}
    </Form.Item>
  );
};

export default ConfigurableFormItem;
