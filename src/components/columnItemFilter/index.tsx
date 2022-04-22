import React, { FC, ChangeEvent, useState, Fragment, useEffect } from 'react';
import { DeleteOutlined, DownOutlined } from '@ant-design/icons';
import { Input, DatePicker, TimePicker, InputNumber, Checkbox, Menu, Dropdown, Select } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import moment, { Moment, isMoment } from 'moment';
import { useGet } from 'restful-react';
import { ColumnFilter, IndexColumnDataType, IndexColumnFilterOption } from '../../providers/dataTable/interfaces';
import { useReferenceListGetItems } from '../../apis/referenceList';
import { AutocompleteItemDto, useAutocompleteList } from '../../apis/autocomplete';
import { humanizeString } from '../../utils/string';

const { RangePicker: DateRangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;

const allOptions = {
  date: ['equals', 'between', 'before', 'after'],
  datetime: ['equals', 'between', 'before', 'after'],
  time: ['equals', 'between', 'before', 'after'],
  number: ['lessThan', 'greaterThan', 'equals', 'between'],
  string: ['contains', 'startsWith', 'endsWith', 'equals'],
};

export const getFilterOptions = (dataType: string): IndexColumnFilterOption[] => {
  return allOptions[dataType] || [];
};

export interface IColumnItemFilterProps {
  id: string;
  filterName: string;
  accessor: string;
  referenceListName: string;
  referenceListNamespace: string;
  entityReferenceTypeShortAlias: string;
  autocompleteUrl?: string;
  dataType: IndexColumnDataType;
  filter: ColumnFilter;
  filterOption: IndexColumnFilterOption;
  onRemoveFilter?: (id: string) => void;
  onChangeFilterOption?: (filterId: string, filterOption: IndexColumnFilterOption) => void;
  onChangeFilter?: (filterId: string, filter: ColumnFilter) => void;
  applyFilters?: () => void;
}

export const ColumnItemFilter: FC<IColumnItemFilterProps> = ({
  id,
  filterName,
  dataType = 'string',
  filterOption,
  onRemoveFilter,
  onChangeFilterOption,
  onChangeFilter,
  filter,
  applyFilters,
  referenceListName,
  referenceListNamespace,
  entityReferenceTypeShortAlias,
  autocompleteUrl,
}) => {
  // @ts-ignore
  const [refListItems, setReflistItems] = useState<ReferenceListItemDto[]>([]);

  //#region Reflist renderer
  const { loading, data } = useReferenceListGetItems({
    queryParams: { namespace: referenceListNamespace, name: referenceListName },
  });

  useEffect(() => {
    if (!loading && data) {
      const { result } = data;

      setReflistItems(result);
    }
  }, [loading]);
  //#endregion

  const options = allOptions[dataType] || [];

  const [minNumber, setMinNumber] = useState<number>(0);
  const [maxNumber, setMaxNumber] = useState<number>(0);
  const [showDeleteIcon, setShowIconVisibility] = useState<boolean>(true);

  const toggleShowIconVisibility = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    setShowIconVisibility(!showDeleteIcon);
  };

  // This key is supposed to be of type MenuClickEventHandler but I'm not getting it
  const handleFilterOptionChange = ({ key }: { key: React.Key }) => {
    // setFilterOption(option);
    onChangeFilterOption(id, key as IndexColumnFilterOption);
  };

  // Make sue that you initialize the `IndexColumnFilterOption` once when the component gets rendered
  useEffect(() => {
    if (!filter) {
      onChangeFilterOption(id, options[0]);
    }
  }, []);

  const handleFilter = (changeValue: number | string | undefined | ChangeEvent<HTMLInputElement>) => {
    if (changeValue) {
      const value =
        typeof changeValue === 'number' ? changeValue : (changeValue as ChangeEvent<HTMLInputElement>).target.value;

      onChangeFilter(id, value);
    }
  };

  const handlePressEnter = () => {
    if (applyFilters) applyFilters();
  };

  const handleMinNumberChange = (value: number | string | undefined) => {
    if (typeof value === 'number') {
      setMinNumber(value);
      onChangeFilter(id, [value, maxNumber]);
    }
  };

  const handleMaxNumberChange = (value: number | string | undefined) => {
    if (typeof value === 'number') {
      setMaxNumber(value);
      onChangeFilter(id, [minNumber, value]);
    }
  };

  const handleDeleteFilter = () => {
    onRemoveFilter(id);
  };

  const renderFilterInput = (type: IndexColumnDataType = 'string', placeholder: string = `Filter ${filterName}`) => {
    if (type === 'string') {
      return (
        <Input
          size="small"
          onChange={handleFilter}
          onPressEnter={handlePressEnter}
          placeholder={placeholder}
          value={filter as string}
        />
      );
    }

    return (
      <InputNumber
        className="ant-input-number-no-margin"
        size="small"
        onChange={handleFilter}
        onPressEnter={handlePressEnter}
        placeholder={placeholder}
        type="number"
        min={minNumber}
        value={filter as number}
      />
    );
  };

  const renderNumberOptions = () => {
    if (filterOption === 'between') {
      const [min, max] = filter instanceof Array && filter.length === 2 ? filter : [null, null];

      return (
        <Fragment>
          <InputNumber
            size="small"
            onChange={handleMinNumberChange}
            onPressEnter={handlePressEnter}
            placeholder="Min"
            type="number"
            // max={maxNumber}
            value={min as number}
          />

          <InputNumber
            size="small"
            onChange={handleMaxNumberChange}
            onPressEnter={handlePressEnter}
            placeholder="Max"
            type="number"
            // min={minNumber}
            value={max as number}
          />
        </Fragment>
      );
    }

    return renderFilterInput('number');
  };

  const dateFormat = 'DD/MM/YYYY';
  const getMoment = (value: any, format: string): Moment => {
    if (value === null || value === undefined) return undefined;

    if (isMoment(value)) return value;

    return moment(value as string, format).isValid() ? moment(value as string, format) : undefined;
  };

  const renderDateInput = () => {
    const onChange = (_dateEvent: any, dateString: string | string[]) => {
      onChangeFilter(id, dateString);
    };

    if (filterOption === 'between') {
      const range: [Moment, Moment] = [undefined, undefined];
      if (filter instanceof Array) {
        range[0] = getMoment(filter[0], dateFormat);
        range[1] = getMoment(filter[1], dateFormat);
      }

      return <DateRangePicker size="small" onChange={onChange} value={range} format={dateFormat} />;
    }

    return <DatePicker size="small" onChange={onChange} value={getMoment(filter, dateFormat)} format={dateFormat} />;
  };

  const dateTimeFormat = 'DD/MM/YYYY HH:mm';
  const renderDateTimeInput = () => {
    const onChange = (_dateEvent: any, dateString: string | string[]) => {
      onChangeFilter(id, dateString);
    };

    if (filterOption === 'between') {
      const range: [Moment, Moment] = [undefined, undefined];
      if (filter instanceof Array) {
        range[0] = getMoment(filter[0], dateTimeFormat);
        range[1] = getMoment(filter[1], dateTimeFormat);
      }

      return <DateRangePicker size="small" onChange={onChange} value={range} format={dateTimeFormat} showTime={true} />;
    }

    return (
      <DatePicker
        size="small"
        onChange={onChange}
        value={getMoment(filter, dateTimeFormat)}
        format={dateTimeFormat}
        showTime={true}
      />
    );
  };

  const timeFormat = 'HH:mm';
  const renderTimeInput = () => {
    const onChange = (_dateEvent: any, dateString: string | string[]) => {
      onChangeFilter(id, dateString);
    };

    if (filterOption === 'between') {
      const range: [Moment, Moment] = [undefined, undefined];
      if (filter instanceof Array) {
        range[0] = getMoment(filter[0], timeFormat);
        range[1] = getMoment(filter[1], timeFormat);
      }

      return <TimeRangePicker size="small" onChange={onChange} value={range} format={timeFormat} />;
    }

    return <TimePicker size="small" onChange={onChange} value={getMoment(filter, timeFormat)} format={timeFormat} />;
  };

  const renderBooleanInput = () => {
    const onChange = (e: CheckboxChangeEvent) => {
      onChangeFilter(id, e.target.checked);
    };
    return (
      <Checkbox checked={typeof filter === 'boolean' ? filter : false} onChange={onChange}>
        Yes
      </Checkbox>
    );
  };

  const renderRenderReflistDropdown = () => {
    const onChange = (value: any) => {
      onChangeFilter(id, value);
    };

    const filterValue = (filter as string[]) || [];

    return (
      <Select
        size="small"
        //mode={dataType === 'refList' ? null : 'multiple'}
        allowClear
        mode="multiple"
        style={{ width: '100%' }}
        onChange={onChange}
        value={filterValue}
      >
        {refListItems.map(({ id: _id, itemValue, item }) => (
          <Select.Option key={_id} value={itemValue}>
            {item}
          </Select.Option>
        ))}
      </Select>
    );
  };

  const urlFetcher = useGet(autocompleteUrl || '', { lazy: true });
  const standardFetcher = useAutocompleteList({ lazy: true });
  const itemsFetcher = autocompleteUrl ? urlFetcher : standardFetcher;

  //#region Moved useEffect to the top level
  const fetchDefaultList = () => {
    if (entityReferenceTypeShortAlias) {
      itemsFetcher.refetch({
        queryParams: { term: '', typeShortAlias: entityReferenceTypeShortAlias, selectedValue: filter as string },
      });
    }
  };

  useEffect(() => {
    fetchDefaultList();
  }, []);
  //#endregion

  const renderEntityDropdown = () => {
    const handleSearch = (value: any) => {
      if (value) {
        itemsFetcher.refetch({
          queryParams: { term: value, typeShortAlias: entityReferenceTypeShortAlias, selectedValue: filter as string },
        });
      }
    };

    const onChange = (value: any) => {
      onChangeFilter(id, value);
    };

    return (
      <Select
        size="small"
        // mode="default"
        style={{ width: '100%' }}
        onChange={onChange}
        showSearch
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={handleSearch}
        onSelect={fetchDefaultList}
        allowClear={true}
        placeholder="Type to search"
        loading={itemsFetcher.loading}
        value={filter as string}
      >
        {itemsFetcher.data?.result?.map((d: AutocompleteItemDto) => (
          <Select.Option value={d.value} key={d.value}>
            {d.displayText}
          </Select.Option>
        ))}
      </Select>
    );
  };

  const hideFilterOptions = () => ['boolean', 'refList', 'multiValueRefList', 'entityReference'].includes(dataType);

  return (
    <div
      className="sha-column-item-filter"
      onMouseOver={toggleShowIconVisibility}
      onMouseLeave={toggleShowIconVisibility}
    >
      <div className="filter-heading">
        <div className="filter-heading-left">
          <span className="label">{filterName || 'Something'}</span>
          {!hideFilterOptions() && (
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu onClick={handleFilterOptionChange}>
                  {options
                    .filter((o: any) => o !== filterOption)
                    .map((opt: any) => (
                      <Menu.Item key={opt}>{humanizeString(opt)}</Menu.Item>
                    ))}
                </Menu>
              }
            >
              <a className="ant-dropdown-link" href="#">
                {humanizeString(filterOption || '')} <DownOutlined />
              </a>
            </Dropdown>
          )}
        </div>
        <div className="filter-heading-right" onMouseOver={e => e.stopPropagation()}>
          <DeleteOutlined onClick={handleDeleteFilter} />
        </div>
      </div>
      <div className="filter-input">
        {dataType === 'string' && renderFilterInput()}

        {dataType === 'number' && renderNumberOptions()}

        {dataType === 'date' && renderDateInput()}

        {dataType === 'datetime' && renderDateTimeInput()}

        {dataType === 'time' && renderTimeInput()}

        {dataType === 'boolean' && renderBooleanInput()}

        {dataType === 'entityReference' && renderEntityDropdown()}

        {['refList', 'multiValueRefList'].includes(dataType) && renderRenderReflistDropdown()}
      </div>
    </div>
  );
};

export default ColumnItemFilter;
