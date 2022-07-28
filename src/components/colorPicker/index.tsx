import React, { FC, useState, useEffect } from 'react';
import { Popover } from 'antd';
import { ColorResult, SketchPicker, SketchPickerProps } from 'react-color';
import './styles/styles.less';

interface IColorPickerProps extends SketchPickerProps {
  title?: string;
  color?: string;
}

interface IColorPickerState {
  color?: string;
  visible?: boolean;
}

const ColorPicker: FC<IColorPickerProps> = ({ title, color, onChange, onChangeComplete, ...props }) => {
  const [state, setState] = useState<IColorPickerState>({ color, visible: false });

  useEffect(() => {
    setState(prev => ({ ...prev, color }));
  }, [color]);

  const handleVisibleChange = (visible: boolean) => {
    setState(prev => ({ ...prev, visible }));
  };

  const handleClosePicker = () => {
    setState(prev => ({ ...prev, visible: false }));
  };

  const handleColorChange = (localColor: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, color: localColor?.hex }));

    if (onChange) {
      onChange(localColor, event);
    }
  };

  const handleChangeComplete = (localColor: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, color: localColor?.hex }));

    if (onChange) {
      onChange(localColor, event);
    }
  };

  return (
    <Popover
      visible={state?.visible}
      title={title || 'Pick color'}
      trigger="click"
      onVisibleChange={handleVisibleChange}
      content={
        <SketchPicker
          onChange={handleColorChange}
          onChangeComplete={handleChangeComplete}
          {...props}
          color={state?.color}
        />
      }
    >
      <span className="color-picker-selector" style={{ background: state?.color }} />
    </Popover>
  );
};

export default ColorPicker;
