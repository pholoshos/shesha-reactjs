import { IButtonsProps } from './../components/formDesigner/components/button/buttonGroup/buttonsComponent/index';
import { IDropdownProps } from './../components/formDesigner/components/dropdown/models';
import { ITextAreaProps } from './../components/formDesigner/components/textArea/textArea';
import { ILabelValueEditorProps } from './../components/formDesigner/components/labelValueEditor/labelValueEditorComponent';
import { ITextFieldProps } from './../components/formDesigner/components/textField/textField';
import { IConfigurableFormComponent } from '.';
import { ISectionSeparatorProps } from '../components/sectionSeparator';
import { IIconPickerComponentProps } from '../components/formDesigner/components/iconPicker';
import { IAutocompleteProps } from '../components/formDesigner/components/autocomplete/autocomplete';
import { ICheckboxProps } from '../components/formDesigner/components/checkbox/checkbox';
import { INumberFieldProps } from '../components/formDesigner/components/numberField/models';
import { IQueryBuilderProps } from '../components/formDesigner/components/queryBuilder/queryBuilderComponent';
import { ICodeEditorComponentProps } from '../components/formDesigner/components/codeEditor';
import { IContainerComponentProps } from '../components/formDesigner/components/container/containerComponent';
import { IPropertyAutocompleteProps } from '../components/propertyAutocomplete/propertyAutocomplete';
import { ICustomFilterProps } from '../components/formDesigner/components/dataTable/filter/models';
import { IFormAutocompleteProps } from '../components/formDesigner/components/formAutocomplete';
import { IConfigurableActionNamesComponentProps } from '../components/formDesigner/components/configurableActionsConfigurator';
import { IEditableTagGroupProps } from '../components/formDesigner/components/editableTagGroup';

interface ToolbarSettingsProp extends Omit<IConfigurableFormComponent, 'type'> {}

type DropdownType = ToolbarSettingsProp & Omit<IDropdownProps, 'type'>;

type SectionSeparatorType = ToolbarSettingsProp & Omit<ISectionSeparatorProps, 'type'>;

type TextFieldType = ToolbarSettingsProp & Omit<ITextFieldProps, 'type'>;

type PropertyAutocompleteType = ToolbarSettingsProp & Omit<IPropertyAutocompleteProps, 'type'>;

type TextAreaType = ToolbarSettingsProp & Omit<ITextAreaProps, 'type'>;

type IconPickerType = ToolbarSettingsProp & Omit<IIconPickerComponentProps, 'type'>;

type AutocompleteType = ToolbarSettingsProp & Omit<IAutocompleteProps, 'type'>;

type FormAutocompleteType = ToolbarSettingsProp & Omit<IFormAutocompleteProps, 'type'>;

type CheckboxType = ToolbarSettingsProp & Omit<ICheckboxProps, 'type'>;

type NumberFieldType = ToolbarSettingsProp & Omit<INumberFieldProps, 'type'>;

type LabelValueEditorType = ToolbarSettingsProp & Omit<ILabelValueEditorProps, 'type'>;

type QueryBuilderType = ToolbarSettingsProp & Omit<IQueryBuilderProps, 'type'>;

type CodeEditorType = ToolbarSettingsProp & Omit<ICodeEditorComponentProps, 'type'>;

type ContainerType = ToolbarSettingsProp & Omit<IContainerComponentProps, 'type'>;

type ButtonGroupType = ToolbarSettingsProp & Omit<IButtonsProps, 'type'>;

type CustomFilterType = ToolbarSettingsProp & Omit<ICustomFilterProps, 'type'>;

type ConfigurableActionConfiguratorType = ToolbarSettingsProp & Omit<IConfigurableActionNamesComponentProps, 'type'>;

type EditableTagGroupType = ToolbarSettingsProp & Omit<IEditableTagGroupProps, 'type'>;

export class DesignerToolbarSettings<T> {
  protected readonly form: IConfigurableFormComponent[];
  protected readonly data?: T;

  constructor();
  constructor(model: T);
  constructor(model?: T) {
    this.data = model;
    this.form = [];
  }
  public addButtons(props: ButtonGroupType | ((data: T) => ButtonGroupType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'buttons' });

    return this;
  }

  public addDropdown(props: DropdownType | ((data: T) => DropdownType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'dropdown' });

    return this;
  }

  public addSectionSeparator(props: SectionSeparatorType | ((data: T) => SectionSeparatorType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'sectionSeparator' });

    return this;
  }

  public addTextField(props: TextFieldType | ((data: T) => TextFieldType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'textField' });

    return this;
  }

  public addPropertyAutocomplete(props: PropertyAutocompleteType | ((data: T) => PropertyAutocompleteType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'propertyAutocomplete' });

    return this;
  }

  public addTextArea(props: TextAreaType | ((data: T) => TextAreaType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'textArea' });

    return this;
  }

  public addIconPicker(props: IconPickerType | ((data: T) => IconPickerType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'iconPicker' });

    return this;
  }

  public addAutocomplete(props: AutocompleteType | ((data: T) => AutocompleteType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'autocomplete' });

    return this;
  }

  public addFormAutocomplete(props: FormAutocompleteType | ((data: T) => FormAutocompleteType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'formAutocomplete' });

    return this;
  }

  public addCheckbox(props: CheckboxType | ((data: T) => CheckboxType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'checkbox' });

    return this;
  }

  public addCodeEditor(props: CodeEditorType | ((data: T) => CodeEditorType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'codeEditor' });

    return this;
  }

  public addContainer(props: ContainerType | ((data: T) => ContainerType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'container' });

    return this;
  }

  public addNumberField(props: NumberFieldType | ((data: T) => NumberFieldType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'numberField' });

    return this;
  }

  public addLabelValueEditor(props: LabelValueEditorType | ((data: T) => LabelValueEditorType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'labelValueEditor' });

    return this;
  }

  public addQueryBuilder(props: QueryBuilderType | ((data: T) => QueryBuilderType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'queryBuilder' });

    return this;
  }

  public addCustomFilter(props: CustomFilterType | ((data: T) => CustomFilterType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'filter' });

    return this;
  }

  public addConfigurableActionConfigurator(
    props: ConfigurableActionConfiguratorType | ((data: T) => ConfigurableActionConfiguratorType)
  ) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'configurableActionConfigurator' });

    return this;
  }

  public addEditableTagGroupProps(props: EditableTagGroupType | ((data: T) => EditableTagGroupType)) {
    const obj = typeof props !== 'function' ? props : props(this.data);

    this.form.push({ ...obj, type: 'editableTagGroup' });

    return this;
  }

  get settings() {
    return this.form;
  }

  get model() {
    return this.model;
  }

  public toJson() {
    return this.form;
  }

  public toJsonString() {
    return JSON?.stringify(this.form);
  }
}
