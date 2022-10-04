import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { ConfigurableFormItem } from '../../..';
import { validateConfigurableComponentSettings } from '../../../../formDesignerUtils';
import { IToolboxComponent } from '../../../../interfaces/formDesigner';
import { FormMarkup } from '../../../../providers/form/models';
import settingsFormJson from './settingsForm.json';
import { JoditProps } from 'jodit-react';
import RichTextEditor from '../../../richTextEditor';
import { useForm } from '../../../..';
import { IRichTextEditorProps } from './interfaces';
import { getStyle } from '../../../../providers/form/utils';

const settingsForm = settingsFormJson as FormMarkup;

const RichTextEditorComponent: IToolboxComponent<IRichTextEditorProps> = {
  type: 'richTextEditor',
  name: 'Rich Text Editor',
  icon: <EditOutlined />,
  factory: ({ ...model }: IRichTextEditorProps) => {
    const { formMode, isComponentDisabled, formData } = useForm();
    // const { insertImageAsBase64URI } = model;

    const disabled = isComponentDisabled(model);

    const readOnly = formMode === 'readonly' || model.readOnly;

    const config: JoditProps['config'] = {
      // placeholder: model.placeholder || '',
      toolbar: model?.toolbar,
      preset: model?.preset,
      textIcons: model?.textIcons,
      toolbarButtonSize: model?.toolbarButtonSize,
      // toolbarSticky: model?.toolbarSticky,
      // toolbarStickyOffset: model?.toolbarStickyOffset,
      theme: model?.theme,
      // autofocus: model?.autofocus,
      // useSearch: model?.useSearch,
      iframe: model?.iframe,
      // spellcheck: model?.spellcheck,
      direction: model?.direction,
      // enter: model?.enter,
      // defaultMode: model?.defaultMode,
      // showCharsCounter: model?.showCharsCounter,
      // showWordsCounter: model?.showWordsCounter,
      // showXPathInStatusbar: model?.showXPathInStatusbar,
      // uploader: insertImageAsBase64URI ? { uploader: insertImageAsBase64URI } : null,
      disablePlugins: model?.disablePlugins?.join(',') || '',
      // allowResizeY: model?.allowResizeY,
      height: model?.height,
      // minHeight: model?.minHeight,
      // maxHeight: model?.maxHeight,
      // allowResizeX: model?.allowResizeX,
      width: model?.width,
      // minWidth: model?.minWidth,
      // maxWidth: model?.maxWidth,
      readonly: readOnly || disabled,
      style: getStyle(model?.style, formData),
      defaultTimeout: 0,
      namespace: '',
      safeMode: false,
      safePluginsList: [],
      commandToHotkeys: undefined,
      license: '',
      presets: undefined,
      ownerDocument: undefined,
      ownerWindow: undefined,
      shadowRoot: undefined,
      styleValues: undefined,
      zIndex: 0,
      disabled: false,
      activeButtonsInReadOnly: [],
      allowCommandsInReadOnly: [],
      allowTabNavigation: false,
      inline: false,
      saveModeInStorage: false,
      editorCssClass: '',
      triggerChangeEvent: false,
      language: '',
      debugLanguage: false,
      i18n: false,
      tabIndex: 0,
      statusbar: false,
      showTooltip: false,
      showTooltipDelay: 0,
      useNativeTooltip: false,
      defaultActionOnPaste: 'insert_as_html',
      enter: 'br',
      editHTMLDocumentMode: false,
      enterBlock: 'div',
      defaultMode: 0,
      useSplitMode: false,
      colors: [],
      colorPickerDefaultTab: 'color',
      imageDefaultWidth: 0,
      removeButtons: [],
      extraPlugins: [],
      extraButtons: [],
      extraIcons: undefined,
      createAttributes: undefined,
      sizeLG: 0,
      sizeMD: 0,
      sizeSM: 0,
      buttons: '',
      buttonsMD: '',
      buttonsSM: '',
      buttonsXS: '',
      controls: undefined,
      events: undefined,
      showBrowserColorPicker: false,
    };

    return (
      <ConfigurableFormItem model={model}>
        <RichTextEditor config={config} />
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => ({
    ...model,
    placeholder: 'Start writing text....',
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: true,
    height: 200,
    minHeight: 200,
    minWidth: 200,
    toolbar: true,
    useSearch: true,
    autoHeight: true,
    autoWidth: true,
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    disablePlugins: null,
  }),
};

export default RichTextEditorComponent;
