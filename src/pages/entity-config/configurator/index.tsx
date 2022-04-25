import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { message } from 'antd';
import React, { useRef, useState } from 'react';
import { ModelConfigurator, Page } from '../../../components';
import { IToolbarItem, PageWithLayout } from '../../../interfaces';
import { useShaRouting } from '../../../providers';
import { IModelConfiguratorInstance } from '../../../providers/modelConfigurator/interfaces';

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
    const { router } = useShaRouting();
    const configuratorRef = useRef<IModelConfiguratorInstance>();
    const [loadingState, setLoadingState] = useState<ILoadingState>({});

    const toolbarItems: IToolbarItem[] = [
        {
            title: 'Save',
            icon: <SaveOutlined />,
            onClick: () => {
                if (configuratorRef.current) {
                    setLoadingState({ loading: true, loadingText: 'Saving...' });
                    configuratorRef.current.save()
                        .then(() => {
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
            title: 'Close',
            icon: <CloseOutlined />,
            onClick: () => {
                router?.back();
            },
        },
    ];
    return (
        <Page
            title="Entity Configuration"
            description=""
            toolbarItems={toolbarItems}
            loading={loadingState.loading}
            loadingText={loadingState.loadingText}
        >
            <ModelConfigurator id={id} configuratorRef={configuratorRef} />
        </Page>
    );
};

export default EntityConfiguratorPage;