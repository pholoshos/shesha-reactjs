import React, { FC, Fragment, ReactNode, useEffect, useState } from 'react';
import { Modal, Input, Button, ButtonProps, Select } from 'antd';
import IndexTable from '../indexTable';
import { IAnyObject } from '../../interfaces';
import DataTableProvider, { useDataTable } from '../../providers/dataTable';
import GlobalTableFilter from '../globalTableFilter';
import TablePager from '../tablePager';
import _ from 'lodash';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { EllipsisOutlined } from '@ant-design/icons';
import { IConfigurableColumnsBase } from '../../providers/datatableColumnsConfigurator/models';
import { IModalProps } from '../../providers/dynamicModal/models';
import { useModal } from '../../providers';
import { useSelectedTableRow } from './useSelectedTableRow';
import { usePublish } from '../../hooks';
import Show from '../show';

const UNIQUE_ID = 'HjHi0UVD27o8Ub8zfz6dH';

interface IWrappedEntityPickerProps {
  tableId?: string;
  entityType?: string;
  allowNewRecord?: boolean;
  parentEntityId?: string;
  onDblClick?: (data: any) => void;
}

interface IAddNewRecordProps {
  modalFormId?: string;
  modalTitle?: string;
  showModalFooter?: boolean;
  submitHttpVerb?: 'POST' | 'PUT';
  onSuccessRedirectUrl?: string;
}

export interface IEntityPickerProps extends Omit<IWrappedEntityPickerProps, 'onDblClick'> {
  formId?: string;
  onChange?: (value: string, data: IAnyObject) => void;
  onSelect?: (data: IAnyObject) => void;
  value?: any;
  displayEntityKey?: string;
  disabled?: boolean;
  loading?: boolean;
  name?: string;
  size?: SizeType;
  title?: string;
  useButtonPicker?: boolean;
  pickerButtonProps?: ButtonProps;
  defaultValue?: string;
  entityFooter?: ReactNode;
  configurableColumns?: IConfigurableColumnsBase[]; // Type it later
  addNewRecordsProps?: IAddNewRecordProps;
}

export interface IEntityPickerState {
  showModal?: boolean;
  selectedRowIndex?: number;
  // selectedValue?: string;
  selectedRow?: IAnyObject;
  globalStateKey?: string;
}

const INITIAL_STATE: IEntityPickerState = {
  selectedRowIndex: -1,
  // selectedValue: '',
  // selectedRow: null,
};

export const COLUMNS_CHANGED_EVENT_NAME = 'EntityPickerColumnsConfigChanged';

export const EntityPickerInner: FC<IEntityPickerProps> = ({
  tableId,
  entityType,
  displayEntityKey = 'displayName',
  onChange,
  disabled,
  loading,
  value,
  name,
  size,
  useButtonPicker,
  pickerButtonProps,
  onSelect,
  defaultValue,
  title = 'Select Item',
  configurableColumns,
  formId,
  addNewRecordsProps,
}) => {
  const [state, setState] = useState<IEntityPickerState>({
    showModal: false,
    ...INITIAL_STATE,
  });

  const {
    registerConfigurableColumns,
    tableData,
    setPredefinedFilters,
    changeSelectedStoredFilterIds,
    selectedStoredFilterIds,
    columns,
  } = useDataTable();

  usePublish(COLUMNS_CHANGED_EVENT_NAME, () => ({ stateId: 'NOT_PROVIDED', state: columns }), [columns]);

  // useEffect(() => {
  //   dispatchEvent(new CustomEvent(COLUMNS_CHANGED_EVENT_NAME, { detail: { stateId: 'NOT_PROVIDED', state: columns } }));
  // }, [columns]);

  const showPickerDialog = () => setState(prev => ({ ...prev, showModal: true }));

  const hidePickerDialog = () => setState(prev => ({ ...prev, showModal: false }));

  const modalProps: IModalProps = {
    id: formId,
    isVisible: false,
    formId: addNewRecordsProps?.modalFormId,
    title: addNewRecordsProps?.modalTitle,
    showModalFooter: addNewRecordsProps?.showModalFooter,
    submitHttpVerb: addNewRecordsProps?.submitHttpVerb,
    onSuccessRedirectUrl: addNewRecordsProps?.onSuccessRedirectUrl,
    onSubmitted: (value: any) => {
      if (onDblClick) {
        onDblClick(value);
      }
    },
  };

  const dynamicModal = useModal(modalProps);

  const { data, loading: isFetchingExtraRow } = useSelectedTableRow(value);

  console.log('EntityPickerInner data, isFetchingExtraRow: ', data, isFetchingExtraRow);

  useEffect(() => {
    const { showModal } = state;
    if (showModal) {
      if (selectedStoredFilterIds?.length && selectedStoredFilterIds?.includes(UNIQUE_ID)) {
        changeSelectedStoredFilterIds([]);
      }
    } else {
    }
  }, [state?.showModal]);

  useEffect(() => {
    // This is important for form designer configured picker
    // register columns
    if (formId && configurableColumns) {
      registerConfigurableColumns(formId, configurableColumns);
    }
  }, [formId, configurableColumns]);

  if (!tableId && !entityType) {
    throw new Error(
      'Please make sure that either tableId or entityType is configured for the entity picker to work properly'
    );
  }

  const onAddNew = () => {
    if (addNewRecordsProps.modalFormId) {
      dynamicModal.open();
    } else console.warn('Modal Form is not specified');
  };

  const onDblClick = (row: IAnyObject) => {
    if (onSelect) {
      onSelect(row);
    } else {
      handleOnChange(row);
      setSelectedRow(row);
    }

    hidePickerDialog();
  };

  const onSelectRow = (index: number, row: IAnyObject) => {
    handleOnChange(row);

    setSelectedRow(row, index);
  };

  const handleOnChange = (row: IAnyObject) => {
    if (onChange && !_.isEmpty(row)) {
      onChange(row && (row.id || row.Id), row);
    }
  };

  const onModalOk = () => {
    if (onSelect && state?.selectedRow) {
      onSelect(state?.selectedRow);
    }

    hidePickerDialog();
  };

  const handleCancel = () => {
    hidePickerDialog();
  };

  const getValueRow = () => {
    if (value && Array.isArray(tableData) && tableData.length && tableData[0]?.[displayEntityKey]) {
      return tableData.find(i => (i as any)?.Id === value)?.[displayEntityKey];
    }

    return value;
  };

  const setSelectedRow = (selectedRow: IAnyObject, selectedRowIndex?: number) => {
    let selectedValue = value;

    if (selectedRow && Object.keys(selectedRow).length) {
      selectedValue = displayEntityKey
        ? selectedRow[displayEntityKey]
        : selectedRow?.displayName || selectedRow?.DisplayName || selectedRow?.name || selectedRow?.Name;
    }

    setState({
      ...state,
      selectedRow,
      selectedRowIndex: selectedRowIndex === null ? state?.selectedRowIndex : selectedRowIndex,
    });
  };

  const handleButtonPickerClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event?.stopPropagation();

    showPickerDialog();
  };

  const footer = (
    <Fragment>
      <Button type="primary" onClick={onAddNew}>
        Add New
      </Button>

      <Button onClick={handleCancel}>Close</Button>
    </Fragment>
  );

  return (
    <div className="entity-picker-container">
      <div>
        {useButtonPicker ? (
          <Button onClick={handleButtonPickerClick} size={size} {...(pickerButtonProps || {})}>
            {title}
          </Button>
        ) : (
          <Input.Group compact className="picker-input-group">
            <Show when={Boolean(value) && !getValueRow()}>
              <Input
                allowClear
                className="picker-input-group-input"
                value={getValueRow()}
                disabled={disabled}
                name={name}
                size={size}
                defaultValue={defaultValue}
              />
            </Show>

            <Show when={!Boolean(value)}>
              <Select style={{ width: 200 }}>
                {columns?.map(({ caption, id }) => (
                  <Select.Option key={id} value={id}>
                    {caption}
                  </Select.Option>
                ))}
              </Select>
            </Show>

            <Button
              onClick={showPickerDialog}
              className="picker-input-group-ellipsis"
              disabled={disabled}
              loading={loading ?? false}
              size={size}
              icon={<EllipsisOutlined />}
            />
          </Input.Group>
        )}
      </div>

      <Modal
        title={title || 'Select Item'}
        className="entity-picker-modal"
        visible={state?.showModal}
        onOk={onModalOk}
        onCancel={handleCancel}
        width="60%"
        okText="Select"
        footer={footer}
      >
        <>
          <GlobalTableFilter
            searchProps={{ size: 'middle', autoFocus: true, placeholder: 'Search by Title, Type or Keyword...' }}
          />

          <div className="entity-picker-modal-pager-container">
            <TablePager />
          </div>

          <IndexTable
            onSelectRow={onSelectRow}
            onDblClick={onDblClick}
            selectedRowIndex={state?.selectedRowIndex}
            // extraRows={data ? [data] : null}
          />
        </>
      </Modal>
    </div>
  );
};

// interface IPropertiesPickerProps {
//   onChange: (value: string) => {

//   }
// }

// const PropertiesPicker = () =>

export const EntityPicker: FC<IEntityPickerProps> = props => {
  const { tableId, parentEntityId, entityType } = props;
  return (
    <DataTableProvider
      tableId={tableId}
      // onDblClick={onDblClick}
      parentEntityId={parentEntityId}
      entityType={entityType}
    >
      <EntityPickerInner {...props} />
    </DataTableProvider>
  );
};

export default EntityPicker;
