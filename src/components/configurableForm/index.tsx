import React, { FC } from 'react';
import ConfigurableFormRenderer from './configurableFormRenderer';
import { IConfigurableFormProps } from './models';
import { FormProvider } from '../../providers/form';
import ConfigurableComponent from '../appConfigurator/configurableComponent';
import EditViewMsg from '../appConfigurator/editViewMsg';
import { useAppConfigurator, useShaRouting, useSheshaApplication } from '../../providers';
import classNames from 'classnames';

export const ConfigurableForm: FC<IConfigurableFormProps> = props => {
  const { formId, markup, mode, actions, sections, context, formRef, ...restProps } = props;
  const { switchApplicationMode } = useAppConfigurator();
  const app = useSheshaApplication();

  const canConfigure = Boolean(app.routes.formsDesigner) && Boolean(formId);
  const { router } = useShaRouting(false) ?? {};

  return (
    <ConfigurableComponent
      canConfigure={canConfigure}
      onStartEdit={() => {
        const url = typeof(formId) === 'string'
          ? `${app.routes.formsDesigner}?id=${formId}`
          : Boolean(formId.name)
            ? `${app.routes.formsDesigner}?module=${formId.module}&name=${formId.name}`
            : null;

        if (url){
          router?.push(url);
        }
        switchApplicationMode('live');
      }}
    >
      {(componentState, BlockOverlay) => (
        <div className={classNames(componentState.wrapperClassName, props?.className)}>
          <BlockOverlay>
            <EditViewMsg />
          </BlockOverlay>
          <FormProvider
            formId={formId}
            markup={markup}
            mode={mode}
            form={restProps.form}
            actions={actions}
            sections={sections}
            context={context}
            formRef={formRef}
            onValuesChange={restProps.onValuesChange}
          >
            <ConfigurableFormRenderer {...restProps} />
          </FormProvider>
        </div>
      )}
    </ConfigurableComponent>
  );
};

export default ConfigurableForm;
