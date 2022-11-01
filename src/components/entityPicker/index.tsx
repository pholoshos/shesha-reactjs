import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Select, Skeleton } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import _ from 'lodash';
import { nanoid } from 'nanoid/non-secure';
import React, { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useMedia } from 'react-use';
import { IAnyObject } from '../../interfaces';
import { useModal } from '../../providers';
import DataTableProvider, { useDataTable } from '../../providers/dataTable';
import { IModalProps } from '../../providers/dynamicModal/models';
import { useEntitySelectionData } from '../../utils/entity';
import GlobalTableFilter from '../globalTableFilter';
import IndexTable from '../indexTable';
import ReadOnlyDisplayFormItem from '../readOnlyDisplayFormItem';
import TablePager from '../tablePager';
import { IEntityPickerProps, IEntityPickerState } from './models';

const UNIQUE_ID = 'HjHi0UVD27o8Ub8zfz6dH';

export const EntityPicker: FC<IEntityPickerProps> = ({ displayEntityKey = '_displayName', ...restProps }) => {
  return restProps.readOnly
    ? <EntityPickerReadOnly {...restProps} displayEntityKey={displayEntityKey} />
    : <EntityPickerEditable {...restProps} displayEntityKey={displayEntityKey} />;
}

export const EntityPickerReadOnly: FC<IEntityPickerProps> = (props) => {
  const {
    entityType,
    displayEntityKey,
    value,
  } = props;

  const selection = useEntitySelectionData({
    entityType: entityType,
    propertyName: displayEntityKey,
    selection: value,
  });
  const selectedItems = selection?.rows;

  const displayText = useMemo(() => {
    return selectedItems?.map(ent => ent[displayEntityKey]).join(', ');
  }, [selectedItems]);

  return selection.loading
    ? <Skeleton paragraph={false} active />
    : <ReadOnlyDisplayFormItem value={displayText} />;
}

export const EntityPickerEditableInner: FC<IEntityPickerProps> = (props) => {
  const {
    entityType,
    displayEntityKey,
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
    addNewRecordsProps,
    configurableColumns,
  } = props;

  const [modalId] = useState(nanoid()); // use generated value because formId was changed. to be reviewed
  const [state, setState] = useState<IEntityPickerState>({
    showModal: false,
  });
  const isSmall = useMedia('(max-width: 480px)');

  const {
    changeSelectedStoredFilterIds,
    selectedStoredFilterIds,
    registerConfigurableColumns,
  } = useDataTable();
  const selectRef = useRef(undefined);

  useEffect(() => {
    registerConfigurableColumns(modalId, configurableColumns);
  }, [configurableColumns]);

  const showPickerDialog = () => setState(prev => ({ ...prev, showModal: true }));

  const hidePickerDialog = () => setState(prev => ({ ...prev, showModal: false }));

  const selection = useEntitySelectionData({
    entityType: entityType,
    propertyName: displayEntityKey,
    selection: value,
  });
  const selectedItems = selection?.rows;

  const modalProps: IModalProps = {
    id: modalId,
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

  const selectedMode = mode === 'single' ? undefined : mode;

  const isMultiple = mode === 'multiple';

  useEffect(() => {
    const { showModal } = state;
    if (showModal) {
      if (selectedStoredFilterIds?.length && selectedStoredFilterIds?.includes(UNIQUE_ID)) {
        changeSelectedStoredFilterIds([]);
      }
    }
  }, [state?.showModal]);

  if (!entityType) {
    throw new Error(
      'Please make sure that either entityType is configured for the entity picker to work properly'
    );
  }

  const onAddNew = () => {
    if (addNewRecordsProps.modalFormId) {
      dynamicModal.open();
    } else console.warn('Modal Form is not specified');
  };

  const onDblClick = (row: IAnyObject) => {
    if (!row)
      return;

    if (onSelect) {
      onSelect(row);
    } else {
      if (isMultiple) {
        const selectedItems = value && Array.isArray(value)
          ? value
          : [];
        if (!selectedItems.includes(row.id))
          selectedItems.push(row.id);

        onChange(selectedItems, null);
      } else {
        onChange(row.id, null);
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

  const handleMultiChange = (selectedValues) => {
    if (onChange)
      onChange(selectedValues, null);
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

  const options = useMemo<DefaultOptionType[]>(() => {
    let result: DefaultOptionType[] = null;
    if (selection.loading){
      const items = value
        ? Array.isArray(value)
          ? value
          : [value]
        : [];

      result = items.map(item => ({ label: 'loading...', value: item, key: item }));
    } else {
      result = (selectedItems ?? []).map((ent) => ({ label: ent[displayEntityKey], value: ent.id, key: ent.id }));
    }

    return result;
  }, [selectedItems]);

  const canAddNew = Boolean(addNewRecordsProps) && addNewRecordsProps.modalFormId;
  const footer = (
    <Fragment>
      {canAddNew && (
        <Button type="primary" onClick={onAddNew} size={size}>
          Add New
        </Button>
      )}
      <Button onClick={handleCancel} size={size}>
        Close
      </Button>
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
          <Input.Group style={{ width: '100%' }}>
            <Select
              size={size}
              onFocus={() => {
                selectRef.current.blur();
                showPickerDialog();
              }}
              value={ selection.loading ? undefined : value }
              placeholder={ selection.loading ? 'Loading...' : undefined }
              notFoundContent={''}
              defaultValue={defaultValue}
              disabled={disabled || selection.loading}
              ref={selectRef}
              allowClear
              mode={selectedMode}
              options={options}
              showArrow={false}
              onChange={handleMultiChange}
              style={{ width: "calc(100% - 32px)" }}
              loading={selection.loading}
            >
              {''}
            </Select>
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
        open={state?.showModal}
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
            options={{ omitClick: true }}
          />
        </>
      </Modal>
    </div>
  );
};

export const EntityPickerEditable: FC<IEntityPickerProps> = props => {
  const {
    parentEntityId,
    entityType,
    displayEntityKey,
  } = props;

  return (
    <DataTableProvider
      parentEntityId={parentEntityId}
      entityType={entityType}
    >
      <EntityPickerEditableInner {...props} displayEntityKey={displayEntityKey} />
    </DataTableProvider>
  );
};

export default EntityPicker;
