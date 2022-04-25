import React, { FC } from 'react';
import { EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAppConfigurator } from '../../providers';
import SwitchToEditModeConfirmation from './switchToEditModeConfirmation';
import SwitchToLiveModeConfirmation from './switchToLiveModeConfirmation';

export interface IAppEditModeTogglerProps {}

export const AppEditModeToggler: FC<IAppEditModeTogglerProps> = () => {
  const { mode, toggleCloseEditModeConfirmation, toggleEditModeConfirmation } = useAppConfigurator();

  if (mode === 'edit') {
    return (
      <>
        <CheckCircleOutlined title="Click to close Edit Mode" onClick={() => toggleCloseEditModeConfirmation(true)} />
        <SwitchToLiveModeConfirmation/>
      </>
    );
  } else {
    return (
      <>
        <EditOutlined title="Click to launch Edit Mode" onClick={() => toggleEditModeConfirmation(true)} />
        <SwitchToEditModeConfirmation/>
      </>
    );
  }
};

export default AppEditModeToggler;
