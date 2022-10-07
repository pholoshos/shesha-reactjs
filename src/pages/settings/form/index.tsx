import {
  ExportOutlined,
  ImportOutlined,
  UploadOutlined,
  DeleteOutlined,
  WarningOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { Button, Form, message, Modal } from 'antd';
import Upload, { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { FC, Fragment, useRef, useState } from 'react';
import { useMutate } from 'restful-react';
import { GenericIndexPageDefault, IIndexTableFullProps, OnSuccessActionType } from '../../../components';
import { IShaDataTableProps } from '../../../interfaces';
import { DataTableFullInstance } from '../../../providers/dataTable/contexts';

//import { useCreateForm } from './defaults/utils';

export interface IFormsIndexPageProps {
  tableProps?: Omit<IIndexTableFullProps, 'id'>;
}

interface IPageState {
  isCreateModalVisible?: boolean;
  isUploadImportModalVisible?: boolean;
  isDeleteModalVisible?: boolean;
  isDuplicateModalVisible?: boolean;
  selectedRowIds?: string[];
  uploadFile?: UploadChangeParam<UploadFile>;
}

const FormsIndexPage: FC<IFormsIndexPageProps> = ({ tableProps }) => {
  const tableRef = useRef<DataTableFullInstance>();

  const [state, setState] = useState<IPageState>({});

  const { mutate: exportJsonConfigs } = useMutate({
    verb: 'POST',
    path: `/api/services/Forms/Export`,
  });

  const { mutate: uploadJSONFileAsync } = useMutate({
    verb: 'POST',
    path: `/api/services/Forms/Import`,
  });

  const { mutate: deleteConfigsAsync } = useMutate({
    verb: 'DELETE',
    path: `/api/services/Forms/Delete`,
  });

  const { mutate: duplicateConfigsAsync } = useMutate({
    verb: 'POST',
    path: `/api/services/Forms/Duplicate`,
  });

  const tableConfig: IShaDataTableProps = {
    header: 'Forms',
    disableCustomFilters: true,
  };

  const toggleImportToJsonDialog = () =>
    setState(prev => ({ ...prev, isUploadImportModalVisible: !prev?.isUploadImportModalVisible }));

  const handleExportJsonClick = () => {
    exportJsonConfigs({ components: state.selectedRowIds }).then(response => {
      const url = window.URL.createObjectURL(new Blob([JSON.stringify(response)]));
      const link = document.createElement('a');
      link.href = url;
      const timestamp = Date.now();
      const fileName = `exportJsonConfig` + timestamp + `.json`;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    });
  };

  const toggleDeleteConfigDialog = () =>
    setState(prev => ({ ...prev, isDeleteModalVisible: !prev?.isDeleteModalVisible }));

  const toggleDuplicateConfigDialog = () =>
    setState(prev => ({ ...prev, isDuplicateModalVisible: !prev?.isDuplicateModalVisible }));

  const onSelectedIdsChanged = (selectedRowIds: string[]) => setState(prev => ({ ...prev, selectedRowIds }));

  const noSelections = state?.selectedRowIds?.length === 0;

  const oneSelection = state?.selectedRowIds?.length !== 1;

  const handleUpload = (uploadFile: UploadChangeParam<UploadFile>) => {
    setState(prev => ({ ...prev, uploadFile }));
  };

  const handleFileUploadAsync = () => {
    console.log('Handling file upload!');
    const formData = new FormData();
    formData.append('file', state.uploadFile?.fileList[0]?.originFileObj);
    uploadJSONFileAsync(formData)
      .then(response => {
        console.log('Response: ' + response);
        message
          .loading('Config import in progress..', 2.5)
          .then(() => message.warn('Existing configs with same GUID will be overridden', 2.5))
          .then(() => message.success('Configs imported successfully', 2.5))
          .then(() => setState({ isUploadImportModalVisible: false }))
          .then(tableRef?.current?.refreshTable);
      })
      .catch(e => message.error('Failed to import configs' + e));
  };

  const handleDeleteAsync = () => {
    deleteConfigsAsync({ components: state.selectedRowIds })
      .then(response => {
        console.log(response?.result);
        message
          .success('Configs deleted successfully', 2.5)
          .then(() => setState({ isUploadImportModalVisible: false }))
          .then(tableRef?.current?.refreshTable);
      })
      .catch(e => message.error('An error occurred. Message:' + e));
  };

  const handleDuplicateConfigAsync = () => {
    duplicateConfigsAsync({ id: state.selectedRowIds.at(0) })
      .then(response => {
        console.log(response?.result);
        message
          .success('Configs duplicated successfully', 2.5)
          .then(() => setState({ isDuplicateModalVisible: false }))
          .then(tableRef?.current?.refreshTable);
      })
      .catch(e => message.error('An error occurred. Message:' + e));
  };

  const toolbarItems = [
    {
      title: 'Export Configs',
      icon: <ExportOutlined />,
      onClick: handleExportJsonClick,
      disabled: noSelections,
    },
    {
      title: 'Import Configs',
      icon: <ImportOutlined />,
      onClick: toggleImportToJsonDialog,
    },
    {
      title: 'Delete Configs',
      icon: <DeleteOutlined />,
      onClick: toggleDeleteConfigDialog,
      disabled: noSelections,
    },
    {
      title: 'Duplicate Config',
      icon: <CopyOutlined />,
      onClick: toggleDuplicateConfigDialog,
      disabled: oneSelection,
    },
  ];

  return (
    <Fragment>
      <GenericIndexPageDefault
        entityType='Shesha.Framework.Form'
        columns={t => t
          .addProperty("Name", "Name")
          .addProperty("Path", "Path")
          .addProperty("Description", "Description")
          .addProperty("ModelType", "ModelType")
          .addProperty("Settings", "Settings")
          .addProperty("CreationTime", "Created On")
          .addProperty("LastModificationTime", "Updated On")
        }
        createModalProps={{
          title: 'Create Form',
          updater: () => null,//useCreateForm,
          formPath: `/settings/forms/create`,
          OnSuccessAction: OnSuccessActionType.GoToUrl,
          onSuccessUrl: data => {
            return `/settings/forms/designer?id=${data?.result?.id}`;
          },
        }}
        detailsUrl={id => `/settings/forms/designer?id=${id}`}
        editUrl={id => `/settings/forms/edit?id=${id}`}
        title="Forms"
        // props for the index table. selected row IDs. Does not expose selectedRowIds
        {...tableConfig}
        tableProps={{
          onSelectedIdsChanged,
          toolbarItems,
          useMultiselect: true,
          ...tableProps,
          tableRef,
        }}
      />

      <Modal
        title="Upload Import File"
        open={state.isUploadImportModalVisible}
        onOk={handleFileUploadAsync}
        onCancel={toggleImportToJsonDialog}
      >
        <Form>
          <Form.Item>
            <Button icon={<WarningOutlined />} type={'primary'}>
              Existing configs with same GUID will be overridden
            </Button>
          </Form.Item>
          <Form.Item name="file" label="Select File">
            <Upload beforeUpload={() => false} multiple={false} onChange={handleUpload}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Delete Configs"
        open={state.isDeleteModalVisible}
        onOk={handleDeleteAsync}
        onCancel={toggleDeleteConfigDialog}
        okText={'Yes, delete.'}
      >
        <Form>Are you sure you want to delete? This action cannot be undone.</Form>
      </Modal>
      <Modal
        title="Duplicate Config"
        open={state.isDuplicateModalVisible}
        onOk={handleDuplicateConfigAsync}
        onCancel={toggleDuplicateConfigDialog}
        okText={'Yes, duplicate.'}
      >
        <Form>Are you sure you want to duplicate this config?.</Form>
      </Modal>
    </Fragment>
  );
};

export default FormsIndexPage;
