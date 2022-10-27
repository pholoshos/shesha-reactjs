import React, { FC, useState } from 'react';
import { SidebarContainer, ConfigurableFormRenderer } from '../../components';
import { Row, Col, Divider, Typography, Tooltip, Space } from 'antd';
import Toolbox from './toolbox';
import FormDesignerToolbar from './formDesignerToolbar';
import ComponentPropertiesPanel from './componentPropertiesPanel';
import ComponentPropertiesTitle from './componentPropertiesTitle';
import { useForm } from '../../providers/form';
import { MetadataProvider } from '../../providers';
import ConditionalWrap from '../conditionalWrapper';
import { useFormPersister } from '../../providers/formPersisterProvider';
import { useFormDesigner } from '../../providers/formDesigner';
import StatusTag, { IStatusMappings } from '../statusTag';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ConfigurationItemVersionStatus } from '../../utils/configurationFramework/models';

const { Title } = Typography;

const FORM_STATUS_MAPPING: IStatusMappings = {
    mapping: [
        { code: ConfigurationItemVersionStatus.Draft, text: 'Draft', color: '#b4b4b4' },
        { code: ConfigurationItemVersionStatus.Ready, text: 'Ready', color: '#4DA6FF' },
        { code: ConfigurationItemVersionStatus.Live, text: 'Live', color: '#87d068' },
        { code: ConfigurationItemVersionStatus.Cancelled, text: 'Cancelled', color: '#cd201f' },
        { code: ConfigurationItemVersionStatus.Retired, text: 'Retired', color: '#FF7518' },
    ],
    default: { override: 'NOT RECOGNISED', text: 'NOT RECOGNISED', color: '#f50' },
};


export const FormDesignerRenderer: FC = ({ }) => {
    const [widgetsOpen, setWidgetOpen] = useState(true);
    const [fieldPropertiesOpen, setFieldPropertiesOpen] = useState(true);
    const { formProps } = useFormPersister();

    const toggleWidgetSidebar = () => setWidgetOpen(widget => !widget);

    const toggleFieldPropertiesSidebar = () => setFieldPropertiesOpen(prop => !prop);

    const [formValues, setFormValues] = useState({});
    const { formSettings } = useForm();
    const { isDebug, readOnly } = useFormDesigner();

    const fullName = formProps
        ? formProps.module
            ? `${formProps.module}/${formProps.name}`
            : formProps.name
        : null;
    const title = formProps?.label
        ? `${formProps.label} (${fullName})`
        : fullName;

    return (
        <div className="sha-page">
            <div className="sha-page-heading">
                <div className="sha-page-title" style={{ justifyContent: 'left' }}>
                    <Space>
                        {title && <Title level={4} style={{ margin: 'unset' }}>{title} v{formProps.versionNo}</Title>}
                        {/* {formProps.label && (
                            <Title level={4} style={{ margin: 'unset' }}>({formProps.label})</Title>
                        )} */}
                        {formProps.description && (<Tooltip title={formProps.description}>
                            <QuestionCircleOutlined className="sha-help-icon" />
                        </Tooltip>)}
                        <StatusTag value={formProps.versionStatus} mappings={FORM_STATUS_MAPPING} color={null}></StatusTag>
                    </Space>
                </div>
            </div>
            <div className="sha-form-designer">
                <FormDesignerToolbar />

                <ConditionalWrap
                    condition={Boolean(formSettings.modelType)}
                    wrap={content => (
                        <MetadataProvider id="designer" modelType={formSettings.modelType}>
                            {content}
                        </MetadataProvider>
                    )}
                >
                    <SidebarContainer
                        leftSidebarProps={readOnly
                            ? null
                            : {
                                open: widgetsOpen,
                                onOpen: toggleWidgetSidebar,
                                onClose: toggleWidgetSidebar,
                                title: 'Builder Widgets',
                                content: () => <Toolbox />,
                                placeholder: 'Builder Widgets',
                            }
                        }
                        rightSidebarProps={{
                            open: fieldPropertiesOpen,
                            onOpen: toggleFieldPropertiesSidebar,
                            onClose: toggleFieldPropertiesSidebar,
                            title: () => <ComponentPropertiesTitle />,
                            content: () => <ComponentPropertiesPanel />,
                            placeholder: 'Properties',
                        }}
                    //header={() => readOnly ? null : <FormDesignerToolbar />}
                    >
                        {/* <FormDesignerHeader /> */}

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
        </div>
    );
};
