import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Col, message, Modal, Row } from 'antd';
import React, { useRef, useState } from 'react';
import { ModelConfigurator, Page } from '../../../components';
import IndexToolbar from '../../../components/indexToolbar'
import EntityConfigTree, { IEntityConfigTreeInstance } from '../../../components/entityConfigTree';
import { IToolbarItem, PageWithLayout } from '../../../interfaces';
//import { useShaRouting } from '../../../providers';
import { IModelConfiguratorInstance } from '../../../providers/modelConfigurator/interfaces';
import { EntityConfigDto } from '../../../apis/entityConfig';
import { MetadataSourceType } from '../../../interfaces/metadata';

export interface IEntityConfiguratorPageProps {
    id?: string;
}

interface ILoadingState {
    loading?: boolean;
    loadingText?: string;
}

const EntityConfiguratorPage: PageWithLayout<IEntityConfiguratorPageProps> = ({
    id,
}) => {
    //const { router } = useShaRouting();
    const configuratorRef = useRef<IModelConfiguratorInstance>();
    const entityConfigTreeRef = useRef<IEntityConfigTreeInstance>();
    const [loadingState, setLoadingState] = useState<ILoadingState>({});
    const [entityConfigId, setEntityConfigId] = useState<string>(id);
    const [allowDelete, setAllowDelete] = useState<boolean>();
    const [modal, contextHolder] = Modal.useModal();

    const toolbarItems: IToolbarItem[] = [
        {
            title: 'Create new entity',
            icon: <PlusOutlined />,
            onClick: () => {
                setEntityConfigId('');
                configuratorRef.current.createNew({ description: 'test description', source: MetadataSourceType.UserDefined});
            },
        },
        {
            title: 'Save',
            icon: <SaveOutlined />,
            disabled: entityConfigId == null,
            onClick: () => {
                if (configuratorRef.current) {
                    setLoadingState({ loading: true, loadingText: 'Saving...' });
                    configuratorRef.current.save()
                        .then((item) => {
                            if (entityConfigId === '') {
                                entityConfigTreeRef.current.refresh(item?.id);
                                setEntityConfigId(item?.id);
                            } else {
                                entityConfigTreeRef.current.update(item);
                            }
                            message.success('Configuration saved successfully');
                        })
                        .catch((error) => {
                            if (!error?.errorFields)
                                message.error('Failed to save configuration');
                        })
                        .finally(() => {
                            setLoadingState({ loading: false, loadingText: null });
                        });
                }
            },
        },
        {
            title: 'Delete',
            icon: <DeleteOutlined />,
            disabled: entityConfigId == null || !allowDelete,
            onClick: () => {
                modal.confirm({
                    content: 'Are you sure want to delete?',
                    onOk: () => {
                        if (configuratorRef.current) {
                            setLoadingState({ loading: true, loadingText: 'Saving...' });
                            configuratorRef.current.delete()
                                .then(() => {
                                    entityConfigTreeRef.current.refresh(null);
                                    setEntityConfigId(null);
                                    message.success('Configuration deleted successfully');
                                })
                                .catch((error) => {
                                    if (!error?.errorFields)
                                        message.error('Failed to delete configuration');
                                })
                                .finally(() => {
                                    setLoadingState({ loading: false, loadingText: null });
                                });
                        }
                    }
                });
            },
        },
        /*{
            title: 'Close',
            icon: <CloseOutlined />,
            onClick: () => {
                router?.back();
            },
        },*/
    ];

    const onChange = (item: EntityConfigDto) => {
        setEntityConfigId(item.id);
        if (configuratorRef.current) configuratorRef.current.changeModelId(item.id);
        setAllowDelete(item.source == MetadataSourceType.UserDefined);
    }

    return (
        <Page
            title="Entity Configuration"
            description=""
            //toolbarItems={toolbarItems}
            loading={loadingState.loading}
            loadingText={loadingState.loadingText}
        >
            <Row>
                <Col span='6'>
                    <div style={{minHeight: '1000px', maxHeight: '1000px', overflow:'scroll'}}>
                    <EntityConfigTree
                        onChange={onChange}
                        defaultSelected={entityConfigId}
                        entityConfigTreeRef={entityConfigTreeRef}
                    />
                    </div>
                </Col>
                <Col span='18'>
                    <IndexToolbar items={toolbarItems} />
                    <ModelConfigurator id={entityConfigId} configuratorRef={configuratorRef} />
                </Col>
            </Row>
            <div>{contextHolder}</div>
        </Page>
    );
};

export default EntityConfiguratorPage;