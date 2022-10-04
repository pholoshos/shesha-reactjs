import React, { CSSProperties, FC, Fragment, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Button, ButtonProps, Select } from 'antd';
import IndexTable from '../indexTable';
import { IAnyObject } from '../../interfaces';
import DataTableProvider, { useDataTable } from '../../providers/dataTable';
import GlobalTableFilter from '../globalTableFilter';
import TablePager from '../tablePager';
import _, { camelCase } from 'lodash';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { EllipsisOutlined } from '@ant-design/icons';
import { IConfigurableColumnsBase } from '../../providers/datatableColumnsConfigurator/models';
import { IModalProps } from '../../providers/dynamicModal/models';
import { useModal } from '../../providers';
import { useSelectedTableRow } from './useSelectedTableRow';
import { usePublish } from '../../hooks';
import Show from '../show';
import ReadOnlyDisplayFormItem from '../readOnlyDisplayFormItem';
import { useMedia } from 'react-use';
import { snakeCase } from 'lodash';
import { useEntityDisplayText } from '../../utils/entity';

const UNIQUE_ID = 'HjHi0UVD27o8Ub8zfz6dH';

interface IWrappedEntityPickerProps {
  tableId?: string;
  entityType?: string;
  allowNewRecord?: boolean;
  parentEntityId?: string;
  onDblClick?: (data: any) => void;
}
interface ISelectedProps {
  id?: string;
  displayName?: string;
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
  mode?: 'single' | 'multiple' | 'tags';
  size?: SizeType;
  title?: string;
  useButtonPicker?: boolean;
  pickerButtonProps?: ButtonProps;
  defaultValue?: string;
  entityFooter?: ReactNode;
  configurableColumns?: IConfigurableColumnsBase[]; // Type it later
  addNewRecordsProps?: IAddNewRecordProps;
  style?: CSSProperties;
  readOnly?: boolean;
}

export interface IEntityPickerState {
  showModal?: boolean;
  selectedRowIndex?: number;
  // selectedValue?: string;
  selectedRow?: IAnyObject;
  globalStateKey?: string;
}

export const COLUMNS_CHANGED_EVENT_NAME = 'EntityPickerColumnsConfigChanged';

export const EntityPickerInner: FC<IEntityPickerProps> = ({
  tableId,
  entityType,
  displayEntityKey = 'displayName',
  onChange,
  disabled,
  loading,
  value,
  mode,
  size,
  useButtonPicker,
  pickerButtonProps,
  onSelect,
  defaultValue,
  title = 'Select Item',
  configurableColumns,
  formId,
  addNewRecordsProps,
  readOnly,
}) => {
  const [state, setState] = useState<IEntityPickerState>({
    showModal: false,
  });
  const [selectedRows, setSelectedRows] = useState<ISelectedProps[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isSmall = useMedia('(max-width: 480px)');

  const {
    registerConfigurableColumns,
    tableData,
    changeSelectedStoredFilterIds,
    selectedStoredFilterIds,
    columns,
  } = useDataTable();
  const selectRef = useRef(undefined);

  usePublish(COLUMNS_CHANGED_EVENT_NAME, () => ({ stateId: 'NOT_PROVIDED', state: columns }), [columns]);

  const showPickerDialog = () => setState(prev => ({ ...prev, showModal: true }));

  const hidePickerDialog = () => setState(prev => ({ ...prev, showModal: false }));
  const storedId = useMemo(() => {
    if (typeof value == 'object') {
      return value;
    } else if (!!value) {
      return (value as string).split(',');
    }
    return value;
  }, [value]);

  
  const displayName = useEntityDisplayText({
    entityType: entityType,
    propertyName: displayEntityKey,
    entityId: storedId,
  });

  const modalProps: IModalProps = {
    id: formId,
    isVisible: false,
    formId: addNewRecordsProps?.modalFormId,
    title: addNewRecordsProps?.modalTitle,
    showModalFooter: addNewRecordsProps?.showModalFooter,
    submitHttpVerb: addNewRecordsProps?.submitHttpVerb,
    onSuccessRedirectUrl: addNewRecordsProps?.onSuccessRedirectUrl,
    onSubmitted: (localValue: any) => {
      if (onDblClick) {
        onDblClick(localValue);
      }
    },
  };

  const dynamicModal = useModal(modalProps);

  const { data } = useSelectedTableRow(value);


  const selectedMode = mode === 'single' ? undefined : mode;

  const isMultiple = mode === 'multiple'

  const records = useMemo(() => {
    return data ? [...tableData, data] : tableData;
  }, [tableData, data]);
  
  useEffect(() => {
    // This is important for form designer configured picker
    // register columns
    if (formId && configurableColumns) {
      registerConfigurableColumns(formId, configurableColumns);
    }
  }, [formId, configurableColumns]);


  useEffect(() => {
    if (!!value && !selectedRows.length && displayName) {
      const labelNames = displayName.split(',');
      let initialValue: ISelectedProps[] = [];

      for (let i = 0; i < storedId.length; i++) {
        initialValue.push({ displayName: labelNames[i], id: storedId[i] });
      }
      setSelectedRows(() => initialValue);
    }
  }, [displayName]);


  useEffect(() => {
    if (!!selectRef) {
      setSelectedIds(() => selectedRows.map(({ id }) => id));
    }
  }, [selectedRows]);

  useEffect(() => {
    const { showModal } = state;
    if (showModal) {
      if (selectedStoredFilterIds?.length && selectedStoredFilterIds?.includes(UNIQUE_ID)) {
        changeSelectedStoredFilterIds([]);
      }
    }
  }, [state?.showModal]);





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
      let isNewRow = !selectedRows?.map(({ id }) => id)?.includes(row?.id);
      
      let propertyName = camelCase(snakeCase(displayEntityKey));

      if (isNewRow && isMultiple) {
        setSelectedRows(prev => [...prev, { id: row?.id, displayName: row[propertyName] }]);
        onChange([...selectedIds, row?.id].toString(), null);
      }else{
        setSelectedRows(() => [{ id: row?.id, displayName: row[propertyName] }]);
        onChange(row?.id, null);
      }
    }

    hidePickerDialog();
  };

  const onSelectRow = (_index: number, row: IAnyObject) => {
    handleOnChange(row);
  };

  const handleOnChange = (row: IAnyObject) => {
    if (onChange && !_.isEmpty(row)) {
      onChange(row && (row.id || row.Id), row);
    }
  };

  const handleMultiChange = value => {
    setSelectedRows(() => selectedRows?.filter(row => value?.includes(row?.id)));
    setSelectedIds(() => value);
    onChange(value, null);
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

  

  const handleButtonPickerClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event?.stopPropagation();

    showPickerDialog();
  };

  const selectedRowIndex = useMemo(() => {
    if (records?.length && value) {
      return records?.findIndex((item: any) => item?.Id === value);
    }

    return -1;
  }, [value, records]);

  const options = useMemo(() => {
    return selectedRows.map(({ displayName, id }) => ({ label: displayName, value: id ,key:id}));
  }, [selectedRows]);

  const footer = (
    <Fragment>
      <Button type="primary" onClick={onAddNew} size={size}>
        Add New
      </Button>

      <Button onClick={handleCancel} size={size}>
        Close
      </Button>
    </Fragment>
  );

  if (readOnly) {
    return <ReadOnlyDisplayFormItem value={displayName} />;
  }




  return (
    <div className="entity-picker-container">
      <div>
        {useButtonPicker ? (
          <Button onClick={handleButtonPickerClick} size={size} {...(pickerButtonProps || {})}>
            {title}
          </Button>
        ) : (
          <>
            <Show when={true}>
              <Select
                size={size}
                onFocus={() => {
                  selectRef.current.blur();
                  showPickerDialog();
                }}
                value={selectedIds}
                notFoundContent={''}
                defaultValue={defaultValue}
                disabled={disabled}
                ref={selectRef}
                allowClear
                mode={selectedMode}
                options={options}
                showArrow={false}
                onChange={handleMultiChange}
              >
                {''}
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
            </>
        
        )}
      </div>

      <Modal
        title={title || 'Select Item'}
        className="entity-picker-modal"
        visible={state?.showModal}
        onOk={onModalOk}
        onCancel={handleCancel}
        width={isSmall ? '90%' : '60%'}
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
            selectedRowIndex={selectedRowIndex}
            records={records}
            options={{ omitClick: true }}
          />
        </>
      </Modal>
    </div>
  );
};

export const EntityPicker: FC<IEntityPickerProps> = props => {
  const { parentEntityId, entityType } = props;
  return (
    <DataTableProvider parentEntityId={parentEntityId} entityType={entityType}>
      <EntityPickerInner {...props} />
    </DataTableProvider>
  );
};

export default EntityPicker;
