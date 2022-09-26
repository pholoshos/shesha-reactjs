import React, { FC } from 'react';
import ConfigurableFormRenderer from './configurableFormRenderer';
import { IConfigurableFormProps } from './models';
import { FormProvider } from '../../providers/form';
import ConfigurableComponent from '../appConfigurator/configurableComponent';
import EditViewMsg from '../appConfigurator/editViewMsg';
import { useAppConfigurator, useShaRouting, useSheshaApplication } from '../../providers';
import classNames from 'classnames';
import { FormPersisterConsumer, FormPersisterProvider } from '../../providers/formPersisterProvider';
import { FormMarkupConverter } from '../../providers/formMarkupConverter';
import { FormMarkup } from '../../providers/form/models';

export const ConfigurableForm: FC<IConfigurableFormProps> = props => {
  const { formId, markup, mode, actions, sections, context, formRef, ...restProps } = props;
  const { switchApplicationMode } = useAppConfigurator();
  const app = useSheshaApplication();

  const canConfigure = Boolean(app.routes.formsDesigner) && Boolean(formId);
  const { router } = useShaRouting(false) ?? {};

  const renderWithMarkup = (providedMarkup: FormMarkup) => {
    return (
      <FormMarkupConverter markup={providedMarkup}>
        {(flatComponents) => (
          <FormProvider
            flatComponents={flatComponents}
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
        )}
      </FormMarkupConverter>
    );
  }

  return (
    <ConfigurableComponent
      canConfigure={canConfigure}
      onStartEdit={() => {
        const url = typeof (formId) === 'string'
          ? `${app.routes.formsDesigner}?id=${formId}`
          : Boolean(formId.name)
            ? `${app.routes.formsDesigner}?module=${formId.module}&name=${formId.name}`
            : null;

        if (url && router) {
          router.push(url).then(() => switchApplicationMode('live'));
        }
      }}
    >
      {(componentState, BlockOverlay) => (
        <div className={classNames(componentState.wrapperClassName, props?.className)}>
          <BlockOverlay>
            <EditViewMsg />
          </BlockOverlay>
          {markup
            ? renderWithMarkup(markup)
            : (
              <FormPersisterProvider formId={formId}>
                <FormPersisterConsumer>
                  {persister => renderWithMarkup(persister.markup)}
                </FormPersisterConsumer>
              </FormPersisterProvider>
            )
          }
        </div>
      )}
    </ConfigurableComponent>
  );
};

export default ConfigurableForm;
