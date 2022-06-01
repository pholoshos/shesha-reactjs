import React, { FC } from 'react';
import { EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAppConfigurator } from '../../providers';
import SwitchToEditModeConfirmation from './switchToEditModeConfirmation';
import SwitchToLiveModeConfirmation from './switchToLiveModeConfirmation';
import { PHONE_LG_SIZE_QUERY } from '../../constants/media-queries';
import { useMediaQuery } from 'react-responsive';

export interface IAppEditModeTogglerProps {}

export const AppEditModeToggler: FC<IAppEditModeTogglerProps> = () => {
  const { mode, toggleCloseEditModeConfirmation, toggleEditModeConfirmation } = useAppConfigurator();

  const hideEdit = useMediaQuery({
    query: PHONE_LG_SIZE_QUERY,
  });

  if (hideEdit) return null;

  if (mode === 'edit') {
    return (
      <>
        <CheckCircleOutlined title="Click to close Edit Mode" onClick={() => toggleCloseEditModeConfirmation(true)} />
        <SwitchToLiveModeConfirmation />
      </>
    );
  } else {
    return (
      <>
        <EditOutlined title="Click to launch Edit Mode" onClick={() => toggleEditModeConfirmation(true)} />
        <SwitchToEditModeConfirmation />
      </>
    );
  }
};

export default AppEditModeToggler;
