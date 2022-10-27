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
import { FormRawMarkup, IFormSettings } from '../../providers/form/models';
import { convertToMarkupWithSettings } from '../../providers/form/utils';

export const ConfigurableForm: FC<IConfigurableFormProps> = props => {
  const { formId, markup, mode, actions, sections, context, formRef, refetchData, ...restProps } = props;
  const { switchApplicationMode } = useAppConfigurator();
  const app = useSheshaApplication();

  const canConfigure = Boolean(app.routes.formsDesigner) && Boolean(formId);
  const { router } = useShaRouting(false) ?? {};

  const markupWithSettings = convertToMarkupWithSettings(markup);

  const renderWithMarkup = (providedMarkup: FormRawMarkup, formSettings: IFormSettings) => {
    if (!providedMarkup)
      return null;

    //console.log('LOG:renderWithMarkup', providedMarkup, formSettings);
    return (
      <FormMarkupConverter markup={providedMarkup}>
        {(flatComponents) =>
          <FormProvider
            flatComponents={flatComponents}
            formSettings={formSettings}
            mode={mode}
            form={restProps.form}
            actions={actions}
            sections={sections}
            context={context}
            formRef={formRef}
            onValuesChange={restProps.onValuesChange}
            refetchData={refetchData}
          >
            <ConfigurableFormRenderer {...restProps} />
          </FormProvider>
        }
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
            ? renderWithMarkup(markupWithSettings.components, markupWithSettings.formSettings)
            : (
              <FormPersisterProvider formId={formId}>
                <FormPersisterConsumer>
                  {persister => renderWithMarkup(persister.markup, persister.formSettings)}
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
