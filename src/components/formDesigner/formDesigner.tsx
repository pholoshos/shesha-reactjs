import React, { FC, useState } from 'react';
import { SidebarContainer, ConfigurableFormRenderer } from '../../components';
import { Row, Col, Divider, Skeleton } from 'antd';
import Toolbox from './toolbox';
import FormDesignerToolbar from './formDesignerToolbar';
import ComponentPropertiesPanel from './componentPropertiesPanel';
import ComponentPropertiesTitle from './componentPropertiesTitle';
import { FormProvider, useForm } from '../../providers/form';
import { FormDesignerHeader } from './formDesignerHeader';
import { MetadataProvider } from '../../providers';
import ConditionalWrap from '../conditionalWrapper';
import { FormIdentifier } from '../../providers/form/models';
import { FormPersisterProvider, useFormPersister } from '../../providers/formPersisterProvider';
import { FormPersisterStateConsumer } from '../../providers/formPersisterProvider/contexts';
import { FormDesignerProvider, useFormDesigner } from '../../providers/formDesigner';
import { FormDesignerStateConsumer } from '../../providers/formDesigner/contexts';
import { FormMarkupConverter } from '../../providers/formMarkupConverter';

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
                <FormDesignerProvider flatComponents={flatComponents} formSettings={formStore.formSettings}>
                  <FormDesignerStateConsumer>
                    {designerState => (
                      <FormProvider mode="designer" 
                        flatComponents={{ allComponents: designerState.allComponents, componentRelations: designerState.componentRelations }} 
                        formSettings={designerState.formSettings}
                      >
                        <FormDesignerRenderer formId={formId} />
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

export const FormDesignerRenderer: FC<IFormDesignerProps> = ({ }) => {
  const [widgetsOpen, setWidgetOpen] = useState(true);
  const [fieldPropertiesOpen, setFieldPropertiesOpen] = useState(true);
  const { } = useFormPersister();

  const toggleWidgetSidebar = () => setWidgetOpen(widget => !widget);

  const toggleFieldPropertiesSidebar = () => setFieldPropertiesOpen(prop => !prop);

  const [formValues, setFormValues] = useState({});
  const { formSettings } = useForm();
  const { isDebug } = useFormDesigner();

  return (
    <div className="sha-form-designer">
      <ConditionalWrap
        condition={Boolean(formSettings.modelType)}
        wrap={content => (
          <MetadataProvider id="designer" modelType={formSettings.modelType}>
            {content}
          </MetadataProvider>
        )}
      >
        <SidebarContainer
          leftSidebarProps={{
            open: widgetsOpen,
            onOpen: toggleWidgetSidebar,
            onClose: toggleWidgetSidebar,
            title: 'Builder Widgets',
            content: () => <Toolbox />,
            placeholder: 'Builder Widgets',
          }}
          rightSidebarProps={{
            open: fieldPropertiesOpen,
            onOpen: toggleFieldPropertiesSidebar,
            onClose: toggleFieldPropertiesSidebar,
            title: () => <ComponentPropertiesTitle />,
            content: () => <ComponentPropertiesPanel />,
            placeholder: 'Properties',
          }}
          header={() => <FormDesignerToolbar />}
        >
          <FormDesignerHeader />

          <ConfigurableFormRenderer
            onValuesChange={(_changedValues, allvalues) => {
              setFormValues(allvalues);
            }}
          >
            {isDebug && (
              <>
                <Row>
                  <Divider />
                  <Col span={24}>
                    <pre>{JSON.stringify(formValues, null, 2)}</pre>
                  </Col>
                </Row>
              </>
            )}
          </ConfigurableFormRenderer>
        </SidebarContainer>
      </ConditionalWrap>
    </div>
  );
};

export default FormDesigner;
