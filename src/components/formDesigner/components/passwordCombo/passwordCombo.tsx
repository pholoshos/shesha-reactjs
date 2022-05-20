import { FormInstance, FormItemProps, FormProps, InputProps } from 'antd';
import React, { FC, useState } from 'react';
import PasswordInputCombo from '../../../passwordInputCombo';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

interface IProps {
  readonly confirmPlaceholder: string;
  readonly errorMessage?: string;
  readonly form: FormInstance;
  readonly formItemProps: FormItemProps;
  readonly formItemConfirmProps?: FormItemProps;
  readonly formProps?: FormProps;
  readonly inputProps: InputProps;
  readonly passwordLength: number;
  readonly placeholder: string;
}

interface IState {
  readonly newPassword: string;
  readonly repeatPassword: string;
}

const INIT_STATE: IState = {
  newPassword: '',
  repeatPassword: '',
};

export const PasswordCombo: FC<IProps> = ({
  confirmPlaceholder,
  errorMessage,
  placeholder,
  inputProps,
  form,
  formItemProps,
  formItemConfirmProps,
  formProps,
  passwordLength,
}) => {
  const [state, setState] = useState<IState>(INIT_STATE);
  const { newPassword, repeatPassword } = state;

  const onPasswordChange = ({ target: { value } }: ChangeEvent, key: keyof IState) => {
    form.setFieldsValue({ [key]: value });
    setState(s => ({ ...s, [key]: value }));
  };

  const setNewPassword = (e: ChangeEvent) => onPasswordChange(e, 'newPassword');
  const setRepeatPassword = (e: ChangeEvent) => onPasswordChange(e, 'repeatPassword');

  return (
    <PasswordInputCombo
      newPassword={newPassword}
      repeatPassword={repeatPassword}
      setNewPassword={setNewPassword}
      setRepeatPassword={setRepeatPassword}
      inputProps={inputProps}
      placeholder={placeholder}
      confirmPlaceholder={confirmPlaceholder}
      formItemProps={formItemProps}
      formItemConfirmProps={formItemConfirmProps}
      formProps={formProps}
      passwordLength={passwordLength}
      errorMessage={errorMessage}
      eventSetType={'event'}
      isPasswordOk={_e => {}}
    />
  );
};

export default PasswordCombo;
