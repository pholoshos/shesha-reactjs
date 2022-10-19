import React, { FC } from 'react';
import { Skeleton } from 'antd';
import { FormProvider } from '../../providers/form';
import { FormIdentifier } from '../../providers/form/models';
import { FormPersisterProvider } from '../../providers/formPersisterProvider';
import { FormPersisterStateConsumer } from '../../providers/formPersisterProvider/contexts';
import { FormDesignerProvider } from '../../providers/formDesigner';
import { FormDesignerStateConsumer } from '../../providers/formDesigner/contexts';
import { FormMarkupConverter } from '../../providers/formMarkupConverter';
import { FormDesignerRenderer } from './formDesignerRenderer';
import { ConfigurationItemVersionStatus } from '../../utils/configurationFramework/models';

export interface IFormDesignerProps {
  formId: FormIdentifier;
}

export const FormDesigner: FC<IFormDesignerProps> = ({ formId }) => {
  return (
    <FormPersisterProvider formId={formId}>
      <FormPersisterStateConsumer>
        {formStore => (formStore.markup
          ? (
            <FormMarkupConverter markup={formStore.markup}>
              {flatComponents => (
                <FormDesignerProvider 
                  flatComponents={flatComponents} 
                  formSettings={formStore.formSettings}
                  readonly={formStore.formProps?.versionStatus !== ConfigurationItemVersionStatus.Draft}
                >
                  <FormDesignerStateConsumer>
                    {designerState => (
                      <FormProvider mode="designer" 
                        flatComponents={{ allComponents: designerState.allComponents, componentRelations: designerState.componentRelations }} 
                        formSettings={designerState.formSettings}
                      >
                        <FormDesignerRenderer />
                      </FormProvider>
                    )}
                  </FormDesignerStateConsumer>
                </FormDesignerProvider>
              )}
            </FormMarkupConverter>
          )
          : (<Skeleton></Skeleton>)
        )}
      </FormPersisterStateConsumer>
    </FormPersisterProvider>
  );
}

export default FormDesigner;
