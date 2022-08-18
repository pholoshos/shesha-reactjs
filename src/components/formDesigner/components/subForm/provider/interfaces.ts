export interface SubFormProps {
  formId: string;
  value: any;
  name: string;
  dataSource: 'api' | 'form';
  getUrl?: string;
  postUrl?: string;
  putUrl?: string;
  deleteUrl?: string;
  properties: string[];
  beforeGet?: string;
  onCreated?: string;
  onUpdated?: string;
}
