import React, { FC, useState } from 'react';
import { SidebarContainer, ConfigurableFormRenderer } from '../../components';
import { Row, Col, Divider } from 'antd';
import Toolbox from './toolbox';
import FormDesignerToolbar from './formDesignerToolbar';
import ComponentPropertiesPanel from './componentPropertiesPanel';
import ComponentPropertiesTitle from './componentPropertiesTitle';
import { useForm } from '../../providers/form';
import { FormDesignerHeader } from './formDesignerHeader';
import { MetadataProvider } from '../../providers';
import ConditionalWrap from '../conditionalWrapper';
import { IFormDto } from '../../providers/form/models';

export interface IFormDesignerProps {
  model?: IFormDto;
}

export const FormDesigner: FC<IFormDesignerProps> = ({}) => {
  const [widgetsOpen, setWidgetOpen] = useState(true);
  const [fieldPropertiesOpen, setFieldPropertiesOpen] = useState(true);

  const toggleWidgetSidebar = () => setWidgetOpen(widget => !widget);

  const toggleFieldPropertiesSidebar = () => setFieldPropertiesOpen(prop => !prop);

  const [formValues, setFormValues] = useState({});
  const { isDebug, formSettings } = useForm();

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
