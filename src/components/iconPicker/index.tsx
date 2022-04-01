import React, { FC, ReactNode, useMemo, useState } from 'react';
import { IconBaseProps } from '@ant-design/icons/lib/components/Icon';
import { FilledIconTypes, FILLED_ICON_GROUPS } from './iconNamesFilled';
import ShaIcon from '../shaIcon';
import { Button, Input, Radio, RadioChangeEvent, Modal } from 'antd';
import { SelectOutlined } from '@ant-design/icons';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { OutlinedIconTypes, OUTLINED_ICON_GROUPS } from './iconNamesOutlined';
import SectionSeparator from '../sectionSeparator';
import { TwoToneIconTypes, TWO_FACED_ICON_GROUPS } from './iconNamesTwoTone';
import { humanizeString } from '../../utils/string';

export type ShaIconTypes = FilledIconTypes | OutlinedIconTypes | TwoToneIconTypes;
type IconModes = 'outlined' | 'filled' | 'twoFaced';

interface IIconMode {
  label: string;
  value: IconModes;
  icon?: ShaIconTypes;
}

const ICON_MODE_OPTIONS: IIconMode[] = [
  { label: 'Outlined', value: 'outlined', icon: 'BorderOutlined' },
  { label: 'Filled', value: 'filled' },
  { label: 'Two Faced', value: 'twoFaced' },
];

const ICON_MODE_GROUPS = {
  filled: FILLED_ICON_GROUPS,
  outlined: OUTLINED_ICON_GROUPS,
  twoFaced: TWO_FACED_ICON_GROUPS,
};

export interface IIconPickerProps extends IconBaseProps {
  /** The icon name */
  value?: ShaIconTypes;

  /** A callback for when the icon changes */
  onIconChange?: (icon: ReactNode, iconName: ShaIconTypes) => void;

  /** The size of the select button */
  selectBtnSize?: SizeType;
}

interface IOption {
  mode: IconModes;
  group: typeof FILLED_ICON_GROUPS | typeof OUTLINED_ICON_GROUPS | typeof TWO_FACED_ICON_GROUPS;
}

/**
 * A component for selecting icons, usually for form
 */
const IconPicker: FC<IIconPickerProps> = ({ selectBtnSize = 'middle', value, onIconChange, ...props }) => {
  const [localSelectedIcon, setLocalSelectedIcon] = useState<ShaIconTypes>(value);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOption, setSearchOtion] = useState<IOption>({
    mode: 'outlined',
    group: ICON_MODE_GROUPS['outlined'],
  });

  const toggleModalVisibility = () => setShowModal(visible => !visible);

  const changeIconModes = (e: RadioChangeEvent) => {
    const mode = e.target.value as IconModes;

    setSearchOtion({ mode, group: ICON_MODE_GROUPS[mode] });
  };

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(event?.target?.value);

  const handleIconSelection = (selected: ShaIconTypes) => {
    setLocalSelectedIcon(selected);
    toggleModalVisibility();

    if (onIconChange) {
      onIconChange(<ShaIcon iconName={selected} style={{ fontSize: 30 }} {...props} />, selected);
    }
  };

  const onClear = () => {
    setLocalSelectedIcon(null);
    toggleModalVisibility();
  };

  const memoizedActiveGroup = useMemo(() => {
    if (searchQuery) {
      const _activeGroup = searchOption?.group;
      const filteredGroup = {};
      const objectKeys = Object.keys(_activeGroup);

      for (const key of objectKeys) {
        filteredGroup[key] = _activeGroup[key].filter((groupItem: string) =>
          groupItem?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        );
      }

      return filteredGroup;
    } else {
      return searchOption?.group;
    }
  }, [searchQuery, searchOption?.group]);

  return (
    <div className="sha-icon-picker">
      <div>
        {localSelectedIcon ? (
          <span onClick={toggleModalVisibility} className="sha-icon-picker-selected-icon">
            <ShaIcon iconName={localSelectedIcon} style={{ fontSize: 24 }} {...props} name={localSelectedIcon} />
          </span>
        ) : (
          <Button size={selectBtnSize} icon={<SelectOutlined />} onClick={toggleModalVisibility}>
            Select Icon
          </Button>
        )}
      </div>
      <Modal
        onCancel={toggleModalVisibility}
        onOk={toggleModalVisibility}
        visible={showModal}
        width={950}
        title="Select Icon"
        footer={
          <div>
            <Button onClick={onClear} type="primary" danger>
              Clear
            </Button>
            <Button onClick={toggleModalVisibility}>Cancel</Button>
          </div>
        }
        className="sha-icon-picker-modal"
      >
        <div className="sha-icon-picker-search">
          <Radio.Group
            options={ICON_MODE_OPTIONS}
            value={searchOption?.mode}
            onChange={changeIconModes}
            optionType="button"
          />

          <div className="sha-icon-picker-search-input-container">
            <Input.Search allowClear onChange={onSearchChange} value={searchQuery} />
          </div>
        </div>
        <div className="sha-icon-picker-icon-list">
          {Object.keys(memoizedActiveGroup).map(groupKey => (
            <div className="sha-icon-picker-icon-list-group" key={groupKey}>
              {memoizedActiveGroup[groupKey]?.length ? (
                <div className="sha-icon-picker-icon-list-group-header">
                  <SectionSeparator sectionName={humanizeString(groupKey)} />
                </div>
              ) : null}

              <div className="sha-icon-picker-icon-list-group-body">
                {memoizedActiveGroup[groupKey].map((item: ShaIconTypes, index) => (
                  <span
                    className="sha-icon-picker-icon-list-icon"
                    onClick={() => handleIconSelection(item)}
                    key={index}
                  >
                    <ShaIcon iconName={item as any} style={{ fontSize: 30, transform: 'scale(.83)' }} />
                    <span className="sha-icon-picker-icon-list-icon-name">{item}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default IconPicker;
