import React, { FC } from 'react';
import ConfigurableFormRenderer from './configurableFormRenderer';
import { IConfigurableFormProps } from './models';
import { FormProvider } from '../../providers/form';
import ConfigurableComponent from '../appConfigurator/configurableComponent';
import EditViewMsg from '../appConfigurator/editViewMsg';
import { useShaRouting } from '../../providers';
import classNames from 'classnames';

export const ConfigurableForm: FC<IConfigurableFormProps> = props => {
  const { id, markup, mode, path, actions, sections, context, formRef, ...restProps } = props;

  const canConfigure = Boolean(id) || Boolean(path);
  const { router } = useShaRouting(false) ?? {};

  return (
    <ConfigurableComponent
      canConfigure={canConfigure}
      onStartEdit={() => {
        if (Boolean(id)) router?.push(`/settings/forms/designer?id=${id}`);
        else if (Boolean(path)) router?.push(`/settings/forms/designer?path=${path}`);
      }}
    >
      {(componentState, BlockOverlay) => (
        <div className={classNames(componentState.wrapperClassName, props?.className)}>
          <BlockOverlay>
            <EditViewMsg />
          </BlockOverlay>
          <FormProvider
            id={id}
            markup={markup}
            mode={mode}
            path={path}
            form={restProps.form}
            actions={actions}
            sections={sections}
            context={context}
            formRef={formRef}
            onValuesChange={restProps.onValuesChange}
          >
            <ConfigurableFormRenderer {...restProps} formId={id} />
          </FormProvider>
        </div>
      )}
    </ConfigurableComponent>
  );
};

export default ConfigurableForm;
