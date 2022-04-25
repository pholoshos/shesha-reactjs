import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import { useEntityConfigCreate } from '../../../apis/entityConfig';
import { GenericCreateModal, SimpleIndexPageDefault } from '../../../components';
import { IShaDataTableProps, IToolbarItem, PageWithLayout } from '../../../interfaces';
import createEntityConfigMarkup from './createEntityConfigMarkup.json';

export interface IReportingReportProps {
  /**
   * Report designer child table id
   */
  tableConfigId?: string;

  /**
   * Entity configuration details page
   *
   * @default - '/settings/entity-configs/details'
   */
  entityConfigDetailsPageUrl?: string;

  /**
   * Entity configuration edit page
   *
   * @default - '/settings/entity-configs/edit'
   */
  entityConfigEditPageUrl?: string;

  /**
   * Whether the component should render the form using the path. If not true, the component will use the path instead of internal markup
   */
  useFormPath?: boolean;
}

const EntityConfigurationsIndexPage: PageWithLayout<IReportingReportProps> = ({
  tableConfigId = 'EntityConfigs_Index',
  entityConfigDetailsPageUrl = '/settings/entity-configs/details',
  //entityConfigEditPageUrl = '/settings/entity-configs/edit',
  useFormPath = false,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tableRef = useRef<any>();

  const toggleCreateModalVisibility = () => setShowCreateModal(visible => !visible);

  const onSuccess = () => {
    tableRef?.current?.refreshTable();
    setShowCreateModal(false);
  };

  const tableProps: IShaDataTableProps = {
    id: tableConfigId,
    header: 'Entities',
    actionColumns: [
      {
        icon: <SearchOutlined />,
        onClick: (id: string) => `${entityConfigDetailsPageUrl}?id=${id}`,
      },
      // {
      //   icon: <EditOutlined />,
      //   onClick: (id: string) => `${reportEditPageUrl}?id=${id}`,
      // },
      // {
      //   icon: <DeleteOutlined />,
      //   onClick: onDelete,
      // },
    ],
  };

  const toolbarItems: IToolbarItem[] = [
    {
      title: 'Add New',
      icon: <PlusOutlined />,
      onClick: toggleCreateModalVisibility,
      hide: true,
    },
  ];

  return (
    <>
      <SimpleIndexPageDefault
        tableRef={tableRef}
        title="All entities"
        tableConfigId={tableConfigId}
        toolbarItems={toolbarItems}
        {...tableProps}
      />

      {false && (
        <GenericCreateModal
          title="Create New Entity"
          visible={showCreateModal}
          formMarkup={useFormPath ? undefined : (createEntityConfigMarkup as any)}
          formPath={useFormPath ? '/settings/entity-configs/create' : ''}
          updater={useEntityConfigCreate}
          onCancel={toggleCreateModalVisibility}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};

export default EntityConfigurationsIndexPage;
