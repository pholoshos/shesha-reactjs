import React, { FC, useRef } from 'react';
import { Button, Tooltip } from 'antd';
import { DeleteFilled, StopOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import FormComponent from '../formComponent';
import { useForm } from '../../../providers/form';
import DragHandle from './dragHandle';
import ValidationIcon from './validationIcon';
import { Show } from '../../show';
import classNames from 'classnames';
import CustomErrorBoundary from '../../customErrorBoundary';

export interface IConfigurableFormComponentProps {
  id: string;
  index: number;
}

const ConfigurableFormComponent: FC<IConfigurableFormComponentProps> = ({ id /*, index*/, index }) => {
  const {
    formMode,
    visibleComponentIds,
    enabledComponentIds,
    deleteComponent,
    getComponentModel,
    selectedComponentId,
    type: viewType,
  } = useForm();
  const componentRef = useRef(null);

  const onDeleteClick = () => {
    deleteComponent({ componentId: id });
  };

  const componentModel = getComponentModel(id);

  const isDesignMode = formMode === 'designer';
  const hiddenByCondition = visibleComponentIds && !visibleComponentIds.includes(componentModel.id);
  const disabledByCondition = enabledComponentIds && !enabledComponentIds.includes(componentModel.id);

  const isViewTemplateComponent =
    (viewType === 'dashboard' ||
      viewType === 'details' ||
      viewType === 'masterDetails' ||
      viewType === 'table' ||
      viewType === 'menu') &&
    index === 0;

  if (isViewTemplateComponent && index === 0) {
    console.log('ConfigurableFormComponent isViewTemplateComponent, index :>> ', isViewTemplateComponent, index);
  }

  const renderComponent = () => {
    return (
      <CustomErrorBoundary>
        <FormComponent id={id} componentRef={componentRef} />
      </CustomErrorBoundary>
    );
  };

  if (!isDesignMode) return renderComponent();

  const invalidConfiguration =
    componentModel.settingsValidationErrors && componentModel.settingsValidationErrors.length > 0;

  return (
    <div
      className={classNames('sha-component', {
        selected: selectedComponentId === id,
        'has-config-errors': invalidConfiguration,
      })}
    >
      <span className="sha-component-indicator">
        <Show when={componentModel.hidden || hiddenByCondition}>
          <Tooltip title="This component is hidden by condition. It's now showing because we're in a designer mode">
            <EyeInvisibleOutlined />
          </Tooltip>
        </Show>

        <Show when={componentModel.disabled || disabledByCondition}>
          <Tooltip title="This component is disabled by condition. It's now enabled because we're in a designer mode">
            <StopOutlined />
          </Tooltip>
        </Show>
      </span>

      {invalidConfiguration && <ValidationIcon validationErrors={componentModel.settingsValidationErrors} />}
      <div className="sha-component-controls">
        <Button icon={<DeleteFilled color="red" />} onClick={onDeleteClick} size="small" danger />
      </div>
      <div>
        <DragHandle componentId={id} componentRef={componentRef} />
        <div style={{ paddingLeft: '15px' }}>{renderComponent()}</div>
      </div>
    </div>
  );
};

export default ConfigurableFormComponent;
