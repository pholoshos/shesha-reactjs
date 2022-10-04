interface IData {
  type: 'table' | 'details' | 'form' | 'masterDetailsPage'; // Type of view
  modelType?: string;
  formPath?: string;
}

export const getPayload = (data: IData) => {
  const tableViewMarkup =
    '{"components":[{"id":"{{GEN_KEY}}","type":"container","name":"container8","label":"Container8","labelAlign":"right","parentId":"root","hidden":false,"customVisibility":null,"isDynamic":false,"direction":"vertical","justifyContent":"left","className":"sha-index-table-full","settingsValidationErrors":[],"components":[{"id":"{{NEW_KEY}}","type":"datatableContext","name":"dataTable1","label":"Tables","labelAlign":"right","parentId":"q7XRzGP9StLpD5NeOzfhX","hidden":false,"customVisibility":null,"items":[],"components":[{"id":"fwQ-yyXEThNSF4Bt4msUH","type":"container","name":"horizontalContainer5","label":"Horizontal Container7","labelAlign":"right","parentId":"{{NEW_KEY}}","hidden":false,"customVisibility":null,"items":[],"components":[{"id":"CTI0XKjHMiwet4AuHx__4","type":"container","name":"horizontalContainer6","label":"Horizontal Container7","labelAlign":"right","parentId":"fwQ-yyXEThNSF4Bt4msUH","hidden":false,"customVisibility":null,"justifyContent":"left","items":[],"components":[{"id":"i4jUdZQIeFyj3kYX0EE4Y","type":"tableViewSelector","name":"tableViewSelector1","label":"Table view selector1","labelAlign":"right","parentId":"CTI0XKjHMiwet4AuHx__4","hidden":false,"customVisibility":null,"filters":[],"items":[{"id":"06782a0b-1419-41c7-aca0-dc38eb2d9b2d","sortOrder":0,"name":"Filter 1","filterType":"queryBuilder"},{"id":"b3b8f624-478a-4e1f-90f4-f29829d7c4ad","sortOrder":1,"name":"Filter 2","filterType":"queryBuilder"}]}],"direction":"horizontal","className":"index-table-controls-left","settingsValidationErrors":[],"alignItems":"center"},{"id":"O-ieWwy7eZB-jepFIUeiO","type":"container","name":"horizontalContainer7","label":"Horizontal Container7","labelAlign":"right","parentId":"fwQ-yyXEThNSF4Bt4msUH","hidden":false,"customVisibility":null,"components":[{"id":"tNwqUHpnOf3K-2rkyDV3t","type":"datatable.quickSearch","name":"quickSearch1","label":"Quick Search1","labelAlign":"right","parentId":"O-ieWwy7eZB-jepFIUeiO","hidden":false,"customVisibility":null,"isDynamic":false,"items":[]},{"id":"3y491cGD3fkv8fCRmRhZU","type":"button","name":"btnFilter","label":"","labelAlign":"right","parentId":"O-ieWwy7eZB-jepFIUeiO","hidden":false,"customVisibility":null,"isDynamic":false,"actionType":"custom","buttonType":"link","icon":"FilterOutlined","settingsValidationErrors":[],"customAction":"toggleAdvancedFilter","uniqueStateId":"TABLE_VIEW_TEMPLATE_ID","buttonAction":"executeFormAction","formAction":"TOGGLE_ADVANCED_FILTER"},{"id":"ULOVfm7i7MfYK8PSRtfWq","type":"button","name":"btnToggleColumn","label":"","labelAlign":"right","parentId":"O-ieWwy7eZB-jepFIUeiO","hidden":false,"customVisibility":null,"isDynamic":false,"actionType":"custom","buttonType":"link","icon":"SlidersOutlined","settingsValidationErrors":[],"customAction":"toggleColumnsSelector","buttonAction":"executeFormAction","formAction":"TOGGLE_COLUMNS_SELECTOR","uniqueStateId":"TABLE_VIEW_TEMPLATE_ID"},{"id":"8Y58eVa9ubhYs83X68ZZk","type":"datatable.pager","name":"tablePager1","label":"Table Pager1","labelAlign":"right","parentId":"O-ieWwy7eZB-jepFIUeiO","hidden":false,"customVisibility":null,"isDynamic":false,"items":[]},{"id":"7-jYsb8fQY2f1Hrw6s2Vr","type":"button","name":"btnRefresh","label":"","labelAlign":"right","parentId":"O-ieWwy7eZB-jepFIUeiO","hidden":false,"customVisibility":null,"isDynamic":false,"actionType":"custom","buttonType":"link","icon":"ReloadOutlined","settingsValidationErrors":[],"customAction":"refresh","buttonAction":"executeFormAction","formAction":"REFRESH_TABLE","uniqueStateId":"TABLE_VIEW_TEMPLATE_ID"}],"direction":"horizontal","justifyContent":"space-around","alignItems":"center","settingsValidationErrors":[],"className":"index-table-controls-right"}],"direction":"horizontal","settingsValidationErrors":[],"className":"sha-index-table-control","justifyContent":"space-between","alignItems":"center"},{"id":"g38qlSIIoUYVnzqVaaNEy","type":"container","name":"horizontalContainer2","label":"Horizontal Container7","labelAlign":"right","parentId":"{{NEW_KEY}}","hidden":false,"customVisibility":null,"components":[{"id":"46jNfZhuX5Qf-6cmtqWrO","type":"container","name":"horizontalContainer4","label":"Horizontal Container7","labelAlign":"right","parentId":"g38qlSIIoUYVnzqVaaNEy","hidden":false,"customVisibility":null,"components":[{"id":"nTwIhcOwPLNiFCHkcl6ZH","type":"buttonGroup","name":"buttonGroup1","label":"Button Group1","labelAlign":"right","parentId":"46jNfZhuX5Qf-6cmtqWrO","hidden":false,"isDynamic":false,"items":[{"id":"mrWgvR9f5Y38nFSWDmc1b","itemType":"item","sortOrder":0,"name":"button1","label":"Add","itemSubType":"button","chosen":false,"icon":"PlusOutlined","buttonType":"link","uniqueStateId":"TABLE_VIEW_TEMPLATE_ID","buttonAction":"dialogue","modalTitle":"Add New Record","modalFormMode":"edit","skipFetchData":true,"selected":false},{"id":"DynXwKltw4gpJiAC0QU1R","itemType":"item","sortOrder":1,"name":"button2","label":"Export","itemSubType":"button","chosen":false,"icon":"DownloadOutlined","buttonType":"link","buttonAction":"executeFormAction","formAction":"EXPORT_TO_EXCEL","uniqueStateId":"TABLE_VIEW_TEMPLATE_ID","selected":false}]},{"id":"4bBJP0OY2qzgX--xLWd5V","type":"toolbar","name":"toolbar1","label":"Toolbar1","labelAlign":"right","parentId":"46jNfZhuX5Qf-6cmtqWrO","hidden":false,"customVisibility":null,"items":[{"id":"5eb2b39e-857c-414f-8837-aeebf6e0993a","type":"item","sortOrder":8,"name":"New User","buttonType":"button","buttonAction":"dialogue","modalTitle":"New User","modalFormId":"07e25729-5736-43bc-b561-6e772a4b5bbd","modalActionOnSuccess":"refresh123","modalFormModel":[{"id":"359dd655-1b25-469d-84dd-9ee2d0fb2511","key":"id","value":"new Value"}]},{"id":"00fdcc82-5244-44c0-aeff-26b26a5fdab9","type":"item","sortOrder":9,"name":"separator","buttonType":"separator"},{"id":"df2d236d-5cda-4d95-9848-a269c9bea5fd","type":"item","sortOrder":2,"name":"Open","buttonType":"button","visibility":"return context.selectedRow && context.selectedRow.id","buttonAction":"navigate","targetUrl":"/administration/user-management/details?id="},{"id":"ef7b5318-1cf0-4fe0-805b-ab13d71f1d5a","type":"item","sortOrder":3,"name":"Edit","buttonType":"button","buttonAction":"navigate","targetUrl":"/administration/user-management/edit?id=","visibility":"return context.selectedRow && context.selectedRow.id"},{"id":"31c79a94-4d25-43ee-8161-8d22a379a7ac","type":"item","sortOrder":5,"name":"Delete","buttonType":"button","visibility":"return context.selectedRow && context.selectedRow.id","buttonAction":"executeFormAction","formAction":"deleteRow"},{"id":"c41d8b7f-16a5-4a08-ab99-5ea50966dc32","type":"item","sortOrder":5,"name":"separator","buttonType":"separator","visibility":"return context.selectedRow && context.selectedRow.id"},{"id":"66218f7a-f43c-4d74-af32-d5787feb13e2","type":"group","sortOrder":1,"name":"View PDF","childItems":[{"id":"f33edeee-c868-4001-9fa7-6ce628fe7707","type":"item","sortOrder":2,"name":"Submission","buttonType":"button","selected":false},{"id":"34f42533-40d7-4765-a815-dafa9e0c9b49","type":"item","sortOrder":2,"name":"Route Form","buttonType":"button","selected":false,"buttonAction":"navigate","tooltip":"Lorem ipsum dolor sit amet"}],"selected":false},{"id":"530766c1-b5a3-4f84-9c30-89181e27be25","type":"item","sortOrder":3,"name":"Export to Excel","buttonType":"button","buttonAction":"executeFormAction","formAction":"exportToExcel"},{"id":"9f083987-d31e-4257-a5be-4bb55653779b","type":"item","sortOrder":6,"name":"Test Modal","buttonType":"button","buttonAction":"dialogue","modalForm":"1d0031ce-0fac-43ed-ba88-3810a9319fce","modalFormId":"1d0031ce-0fac-43ed-ba88-3810a9319fce","modalTitle":"Delete User (new)","modalFormModel":"{id: context.selectedRow.id}","modalActionOnSuccess":"refresh"},{"id":"2303005b-51fc-443d-b0da-e7c6dd2030c3","type":"item","sortOrder":7,"name":"Refresh table","buttonType":"button","buttonAction":"executeFormAction","modalTitle":"WoW!","modalFormId":"efd830e2-30e7-4727-ad2b-ac14c6355a07","formAction":"refresh"}]}],"direction":"horizontal","justifyContent":"flex-start"}],"justifyContent":"space-between","items":[],"direction":"horizontal","className":"sha-index-toolbar","settingsValidationErrors":[]},{"id":"9eGVR-Cs4jO-JpOz1VDp0","type":"container","name":"container7","label":"Container7","labelAlign":"right","parentId":"{{NEW_KEY}}","hidden":false,"customVisibility":null,"isDynamic":false,"direction":"vertical","justifyContent":"left","className":"sha-page-content","settingsValidationErrors":[],"components":[{"id":"Kw65oSx72UWN3UXHSfJCS","type":"datatable","name":"dataTable1","label":"DataTable1","labelAlign":"right","parentId":"9eGVR-Cs4jO-JpOz1VDp0","hidden":false,"customVisibility":null,"isDynamic":false,"items":[]}]}],"description":"","settingsValidationErrors":[],"entityType":"{{modelType}}","uniqueStateId":"TABLE_VIEW_TEMPLATE_ID"}]}],"formSettings":{"layout":"horizontal","colon":true,"labelCol":{"span":5},"wrapperCol":{"span":13},"modelType":"{{modelType}}"}}';
  const masterDetailsMarkup = `{"components":[{"id":"16f5b91f-6750-4e82-9212-8f2690fe86a1","type":"container","name":"container8","label":"Container8","labelAlign":"right","parentId":"root","hidden":false,"customVisibility":null,"isDynamic":false,"direction":"vertical","justifyContent":"left","className":"sha-index-table-full","settingsValidationErrors":[],"components":[{"id":"{{NEW_KEY}}","type":"datatableContext","name":"dataTable1","label":"Tables","labelAlign":"right","parentId":"16f5b91f-6750-4e82-9212-8f2690fe86a1","hidden":false,"customVisibility":null,"items":[],"components":[{"id":"fwQ-yyXEThNSF4Bt4msUH","type":"container","name":"horizontalContainer5","label":"Horizontal Container7","labelAlign":"right","parentId":"c168c6eb-87af-4d6e-be95-96c331dc8f29","hidden":false,"customVisibility":null,"items":[],"components":[{"id":"CTI0XKjHMiwet4AuHx__4","type":"container","name":"horizontalContainer6","label":"Horizontal Container7","labelAlign":"right","parentId":"fwQ-yyXEThNSF4Bt4msUH","hidden":false,"customVisibility":null,"justifyContent":"left","items":[],"components":[{"id":"i4jUdZQIeFyj3kYX0EE4Y","type":"tableViewSelector","name":"tableViewSelector1","label":"Table view selector1","labelAlign":"right","parentId":"CTI0XKjHMiwet4AuHx__4","hidden":false,"customVisibility":null,"filters":[],"items":[{"id":"06782a0b-1419-41c7-aca0-dc38eb2d9b2d","sortOrder":0,"name":"Filter 1","filterType":"queryBuilder"},{"id":"b3b8f624-478a-4e1f-90f4-f29829d7c4ad","sortOrder":1,"name":"Filter 2","filterType":"queryBuilder"}]}],"direction":"horizontal","className":"index-table-controls-left","settingsValidationErrors":[],"alignItems":"center"},{"id":"O-ieWwy7eZB-jepFIUeiO","type":"container","name":"horizontalContainer7","label":"Horizontal Container7","labelAlign":"right","parentId":"fwQ-yyXEThNSF4Bt4msUH","hidden":false,"customVisibility":null,"components":[{"id":"tNwqUHpnOf3K-2rkyDV3t","type":"datatable.quickSearch","name":"quickSearch1","label":"Quick Search1","labelAlign":"right","parentId":"O-ieWwy7eZB-jepFIUeiO","hidden":false,"customVisibility":null,"isDynamic":false,"items":[]},{"id":"3y491cGD3fkv8fCRmRhZU","type":"button","name":"btnFilter","label":"","labelAlign":"right","parentId":"O-ieWwy7eZB-jepFIUeiO","hidden":false,"customVisibility":null,"isDynamic":false,"actionType":"custom","buttonType":"link","icon":"FilterOutlined","settingsValidationErrors":[],"customAction":"toggleAdvancedFilter","uniqueStateId":"MASTER_DETAILS_TABLE_VIEW","buttonAction":"executeFormAction","formAction":"TOGGLE_ADVANCED_FILTER"},{"id":"ULOVfm7i7MfYK8PSRtfWq","type":"button","name":"btnToggleColumn","label":"","labelAlign":"right","parentId":"O-ieWwy7eZB-jepFIUeiO","hidden":false,"customVisibility":null,"isDynamic":false,"actionType":"custom","buttonType":"link","icon":"SlidersOutlined","settingsValidationErrors":[],"customAction":"toggleColumnsSelector","buttonAction":"executeFormAction","formAction":"TOGGLE_COLUMNS_SELECTOR","uniqueStateId":"MASTER_DETAILS_TABLE_VIEW"},{"id":"8Y58eVa9ubhYs83X68ZZk","type":"datatable.pager","name":"tablePager1","label":"Table Pager1","labelAlign":"right","parentId":"O-ieWwy7eZB-jepFIUeiO","hidden":false,"customVisibility":null,"isDynamic":false,"items":[]},{"id":"7-jYsb8fQY2f1Hrw6s2Vr","type":"button","name":"btnRefresh","label":"","labelAlign":"right","parentId":"O-ieWwy7eZB-jepFIUeiO","hidden":false,"customVisibility":null,"isDynamic":false,"actionType":"custom","buttonType":"link","icon":"ReloadOutlined","settingsValidationErrors":[],"customAction":"refresh","buttonAction":"executeFormAction","formAction":"REFRESH_TABLE","uniqueStateId":"MASTER_DETAILS_TABLE_VIEW"}],"direction":"horizontal","justifyContent":"space-around","alignItems":"center","settingsValidationErrors":[],"className":"index-table-controls-right"}],"direction":"horizontal","settingsValidationErrors":[],"className":"sha-index-table-control","justifyContent":"space-between","alignItems":"center"},{"id":"g38qlSIIoUYVnzqVaaNEy","type":"container","name":"horizontalContainer2","label":"Horizontal Container7","labelAlign":"right","parentId":"{{NEW_KEY}}","hidden":false,"customVisibility":null,"components":[{"id":"46jNfZhuX5Qf-6cmtqWrO","type":"container","name":"horizontalContainer4","label":"Horizontal Container7","labelAlign":"right","parentId":"g38qlSIIoUYVnzqVaaNEy","hidden":false,"customVisibility":null,"components":[{"id":"nTwIhcOwPLNiFCHkcl6ZH","type":"buttonGroup","name":"buttonGroup1","label":"Button Group1","labelAlign":"right","parentId":"46jNfZhuX5Qf-6cmtqWrO","hidden":false,"isDynamic":false,"items":[{"id":"mrWgvR9f5Y38nFSWDmc1b","itemType":"item","sortOrder":0,"name":"button1","label":"Add","itemSubType":"button","chosen":false,"icon":"PlusOutlined","buttonType":"link","uniqueStateId":"MASTER_DETAILS_TABLE_VIEW","buttonAction":"dialogue","modalTitle":"Add New Record","modalFormMode":"edit","skipFetchData":true,"selected":false},{"id":"DynXwKltw4gpJiAC0QU1R","itemType":"item","sortOrder":1,"name":"button2","label":"Export","itemSubType":"button","chosen":false,"icon":"DownloadOutlined","buttonType":"link","buttonAction":"executeFormAction","formAction":"EXPORT_TO_EXCEL","uniqueStateId":"MASTER_DETAILS_TABLE_VIEW","selected":false}]},{"id":"4bBJP0OY2qzgX--xLWd5V","type":"toolbar","name":"toolbar1","label":"Toolbar1","labelAlign":"right","parentId":"46jNfZhuX5Qf-6cmtqWrO","hidden":false,"customVisibility":null,"items":[{"id":"5eb2b39e-857c-414f-8837-aeebf6e0993a","type":"item","sortOrder":8,"name":"New User","buttonType":"button","buttonAction":"dialogue","modalTitle":"New User","modalFormId":"07e25729-5736-43bc-b561-6e772a4b5bbd","modalActionOnSuccess":"refresh123","modalFormModel":[{"id":"359dd655-1b25-469d-84dd-9ee2d0fb2511","key":"id","value":"new Value"}]},{"id":"00fdcc82-5244-44c0-aeff-26b26a5fdab9","type":"item","sortOrder":9,"name":"separator","buttonType":"separator"},{"id":"df2d236d-5cda-4d95-9848-a269c9bea5fd","type":"item","sortOrder":2,"name":"Open","buttonType":"button","visibility":"return context.selectedRow && context.selectedRow.id","buttonAction":"navigate","targetUrl":"/administration/user-management/details?id="},{"id":"ef7b5318-1cf0-4fe0-805b-ab13d71f1d5a","type":"item","sortOrder":3,"name":"Edit","buttonType":"button","buttonAction":"navigate","targetUrl":"/administration/user-management/edit?id=","visibility":"return context.selectedRow && context.selectedRow.id"},{"id":"31c79a94-4d25-43ee-8161-8d22a379a7ac","type":"item","sortOrder":5,"name":"Delete","buttonType":"button","visibility":"return context.selectedRow && context.selectedRow.id","buttonAction":"executeFormAction","formAction":"deleteRow"},{"id":"c41d8b7f-16a5-4a08-ab99-5ea50966dc32","type":"item","sortOrder":5,"name":"separator","buttonType":"separator","visibility":"return context.selectedRow && context.selectedRow.id"},{"id":"66218f7a-f43c-4d74-af32-d5787feb13e2","type":"group","sortOrder":1,"name":"View PDF","childItems":[{"id":"f33edeee-c868-4001-9fa7-6ce628fe7707","type":"item","sortOrder":2,"name":"Submission","buttonType":"button","selected":false},{"id":"34f42533-40d7-4765-a815-dafa9e0c9b49","type":"item","sortOrder":2,"name":"Route Form","buttonType":"button","selected":false,"buttonAction":"navigate","tooltip":"Lorem ipsum dolor sit amet"}],"selected":false},{"id":"530766c1-b5a3-4f84-9c30-89181e27be25","type":"item","sortOrder":3,"name":"Export to Excel","buttonType":"button","buttonAction":"executeFormAction","formAction":"exportToExcel"},{"id":"9f083987-d31e-4257-a5be-4bb55653779b","type":"item","sortOrder":6,"name":"Test Modal","buttonType":"button","buttonAction":"dialogue","modalForm":"1d0031ce-0fac-43ed-ba88-3810a9319fce","modalFormId":"1d0031ce-0fac-43ed-ba88-3810a9319fce","modalTitle":"Delete User (new)","modalFormModel":"{id: context.selectedRow.id}","modalActionOnSuccess":"refresh"},{"id":"2303005b-51fc-443d-b0da-e7c6dd2030c3","type":"item","sortOrder":7,"name":"Refresh table","buttonType":"button","buttonAction":"executeFormAction","modalTitle":"WoW!","modalFormId":"efd830e2-30e7-4727-ad2b-ac14c6355a07","formAction":"refresh"}]}],"direction":"horizontal","justifyContent":"flex-start"}],"justifyContent":"space-between","items":[],"direction":"horizontal","className":"sha-index-toolbar","settingsValidationErrors":[]},{"id":"9eGVR-Cs4jO-JpOz1VDp0","type":"container","name":"container7","label":"Container7","labelAlign":"right","parentId":"{{NEW_KEY}}","hidden":false,"customVisibility":null,"isDynamic":false,"direction":"vertical","justifyContent":"left","className":"sha-page-content","settingsValidationErrors":[],"components":[{"id":"E_i4GPtfUFg7b75o9APNj","type":"columns","name":"custom Name","label":"Columns1","labelAlign":"right","parentId":"9eGVR-Cs4jO-JpOz1VDp0","hidden":false,"visibility":"Yes","customVisibility":null,"isDynamic":false,"columns":[{"id":"pWI-gdKljOJdftWA5JxUO","flex":12,"offset":0,"push":0,"pull":0,"components":[{"id":"fsmq-6Xgi1ZjNbEmTHDtK","type":"datatable","name":"dataTable1","label":"DataTable1","labelAlign":"right","parentId":"pWI-gdKljOJdftWA5JxUO","hidden":false,"visibility":"Yes","customVisibility":null,"isDynamic":false,"items":[],"containerStyle":"return {\\n  margin: 'unset'\\n}","tableStyle":""}]},{"id":"TxhlJZPWK7kCHMUI2Xy80","flex":12,"offset":0,"push":0,"pull":0,"components":[{"id":"0ColU1QwBAZOkmv2GdPaB","type":"collapsiblePanel","name":"collapsiblePanel1","label":"Details","labelAlign":"right","parentId":"TxhlJZPWK7kCHMUI2Xy80","hidden":false,"visibility":"Yes","customVisibility":null,"isDynamic":false,"expandIconPosition":"right","settingsValidationErrors":[],"components":[{"id":"7WIFBts5ilwzWU3ict4Kz","type":"subForm","name":"subForm1","label":"Sub Form1","labelAlign":"right","parentId":"0ColU1QwBAZOkmv2GdPaB","hidden":false,"visibility":"Yes","customVisibility":null,"isDynamic":false,"dataSource":"api","labelCol":8,"wrapperCol":16,"hideLabel":true,"properties":["Id"],"settingsValidationErrors":[],"formPath":"","entityType":"{{modelType}}","readOnly":true,"queryParams":"return {\\n  id: globalState.MASTER_DETAILS_TABLE_VIEW.selectedRow.id\\n}"}]}]}],"gutterX":12,"gutterY":12,"components":[{"id":"pWI-gdKljOJdftWA5JxUO","flex":12,"offset":0,"push":0,"pull":0,"components":[{"id":"fsmq-6Xgi1ZjNbEmTHDtK","type":"datatable","name":"dataTable1","label":"DataTable1","labelAlign":"right","parentId":"pWI-gdKljOJdftWA5JxUO","hidden":false,"visibility":"Yes","customVisibility":null,"isDynamic":false,"items":[],"containerStyle":"return {\\n  margin: 'unset'\\n}","tableStyle":""}],"parentId":"E_i4GPtfUFg7b75o9APNj"},{"id":"TxhlJZPWK7kCHMUI2Xy80","flex":12,"offset":0,"push":0,"pull":0,"components":[{"id":"0ColU1QwBAZOkmv2GdPaB","type":"collapsiblePanel","name":"collapsiblePanel1","label":"Details","labelAlign":"right","parentId":"TxhlJZPWK7kCHMUI2Xy80","hidden":false,"visibility":"Yes","customVisibility":null,"isDynamic":false,"expandIconPosition":"right","settingsValidationErrors":[],"components":[{"id":"7WIFBts5ilwzWU3ict4Kz","type":"subForm","name":"subForm1","label":"Sub Form1","labelAlign":"right","parentId":"0ColU1QwBAZOkmv2GdPaB","hidden":false,"visibility":"Yes","customVisibility":null,"isDynamic":false,"dataSource":"api","labelCol":8,"wrapperCol":16,"hideLabel":true,"properties":[],"settingsValidationErrors":[],"formPath":"","entityType":"Shesha.Core.Person","readOnly":true,"queryParams":"return {\\n  id: globalState.MASTER_DETAILS_TABLE_VIEW.selectedRow.id\\n}"}]}],"parentId":"E_i4GPtfUFg7b75o9APNj"}]}],"style":"return {\\n  padding: 12\\n}"}],"description":"","settingsValidationErrors":[],"entityType":"{{modelType}}","uniqueStateId":"MASTER_DETAILS_TABLE_VIEW","endpoint":""}]}],"formSettings":{"layout":"horizontal","colon":true,"labelCol":{"span":5},"wrapperCol":{"span":13},"modelType":"{{modelType}}"}}`;
  const formMarkup =
    '{"components":[],"formSettings":{"layout":"horizontal","colon":true,"labelCol":{"span":5},"wrapperCol":{"span":13},"modelType":"{modelType"}}"}}';
  const blankMarkup = formMarkup;
  const detailsViewMarkup = `{"components":[{"id":"LTpAs5bjBJSvHv4nGBSJv","type":"container","name":"container1","label":"Container1","labelAlign":"right","parentId":"root","hidden":false,"customVisibility":null,"isDynamic":false,"direction":"vertical","justifyContent":"left","className":"sha-page","settingsValidationErrors":[],"components":[{"id":"MyzOBFZ10-9WqSosKWcTi","type":"container","name":"container2","label":"Container2","labelAlign":"right","parentId":"LTpAs5bjBJSvHv4nGBSJv","hidden":false,"customVisibility":null,"isDynamic":false,"direction":"horizontal","justifyContent":"space-between","className":"sha-page-heading","settingsValidationErrors":[],"components":[{"id":"Wvw1IVu2YgnnZPJxyh7i_","type":"container","name":"container4","label":"Container4","labelAlign":"right","parentId":"MyzOBFZ10-9WqSosKWcTi","hidden":false,"customVisibility":null,"isDynamic":false,"direction":"horizontal","justifyContent":"left","className":"sha-page-title","settingsValidationErrors":[],"components":[{"code":false,"copyable":false,"delete":false,"disabled":false,"ellipsis":false,"mark":false,"italic":false,"underline":false,"level":4,"id":"Ng0HWo9g972kUxZKpOvsh","type":"title","name":"title2","label":"Title2","labelAlign":"right","parentId":"Wvw1IVu2YgnnZPJxyh7i_","hidden":false,"customVisibility":null,"isDynamic":false,"content":"Title for {{name}} ","settingsValidationErrors":[]},{"mappings":"{\\n  \\"mapping\\": [\\n    {\\n      \\"code\\": 1,\\n      \\"text\\": \\"Completed\\",\\n      \\"color\\": \\"#87d068\\"\\n    },\\n    {\\n      \\"code\\": 2,\\n      \\"text\\": \\"In Progress\\",\\n      \\"color\\": \\"#4DA6FF\\",\\n      \\"override\\": \\"Still Busy!\\"\\n    },\\n    {\\n      \\"code\\": 3,\\n      \\"text\\": \\"Overdue\\",\\n      \\"color\\": \\"#cd201f\\"\\n    },\\n    {\\n      \\"code\\": 4,\\n      \\"text\\": \\"Pending\\",\\n      \\"color\\": \\"#FF7518\\"\\n    }\\n  ],\\n  \\"default\\": {\\n    \\"override\\": \\"NOT RECOGNISED\\",\\n    \\"text\\": \\"NOT RECOGNISED\\",\\n    \\"color\\": \\"#f50\\"\\n  }\\n}","id":"SA7C1L5aQLWO4wqPvK5Ql","type":"statusTag","name":"statusTag1","label":"Status Tag1","labelAlign":"right","parentId":"Wvw1IVu2YgnnZPJxyh7i_","hidden":false,"customVisibility":null,"isDynamic":false,"color":"","settingsValidationErrors":[],"value":"1","colorCodeEvaluator":""}]}]},{"id":"ZkbntfBgs69PnBZHOMaam","type":"container","name":"container5","label":"Container5","labelAlign":"right","parentId":"LTpAs5bjBJSvHv4nGBSJv","hidden":false,"customVisibility":null,"isDynamic":false,"direction":"horizontal","justifyContent":"space-between","className":"sha-page-heading","settingsValidationErrors":[],"components":[{"id":"9AA7y2CVoOXN7KUTJZo_z","type":"buttonGroup","name":"buttonGroup1","label":"Button Group1","labelAlign":"right","parentId":"ZkbntfBgs69PnBZHOMaam","hidden":false,"isDynamic":false,"items":[{"id":"pr8AAGR1-8iqpEv70PfXI","itemType":"item","sortOrder":0,"name":"button1","label":"Cancel Form Edit","itemSubType":"button","chosen":false,"buttonAction":"cancelFormEdit","icon":"CloseOutlined","selected":false,"buttonType":"link","customVisibility":"return formMode === 'edit' || formMode === 'designer';"},{"id":"cV_q1DzZ7UJPQesuh9F8s","itemType":"item","sortOrder":1,"name":"button2","label":"Edit","itemSubType":"button","chosen":false,"selected":false,"icon":"EditOutlined","buttonType":"link","customVisibility":"return formMode === 'readonly' || formMode === 'designer'; ","buttonAction":"startFormEdit"},{"id":"HV8LkxPamUjO2Ob_nzuXl","itemType":"item","sortOrder":2,"name":"button3","label":"Save","itemSubType":"button","chosen":false,"selected":false,"icon":"CheckOutlined","customVisibility":"return formMode === 'edit' || formMode === 'designer';","buttonAction":"submit","buttonType":"link"}]}]},{"id":"P927vPjBPClDFCjlmlGtS","type":"container","name":"container3","label":"Container3","labelAlign":"right","parentId":"LTpAs5bjBJSvHv4nGBSJv","hidden":false,"customVisibility":null,"isDynamic":false,"direction":"vertical","justifyContent":"left","className":"sha-page-content","settingsValidationErrors":[],"components":[{"id":"HkFs1aWIaHZ65etvH2Qdb","type":"collapsiblePanel","name":"collapsiblePanel1","label":"Details","labelAlign":"right","parentId":"P927vPjBPClDFCjlmlGtS","hidden":false,"customVisibility":null,"isDynamic":false,"expandIconPosition":"right","settingsValidationErrors":[],"components":[{"textType":"text","id":"gVEs1zAwkIfbJiRIq22Pg","type":"textField","name":"name","label":"Name","labelAlign":"right","hidden":false,"customVisibility":null,"isDynamic":false,"maxLength":null,"parentId":"HkFs1aWIaHZ65etvH2Qdb"}]}]},{"code":false,"copyable":false,"delete":false,"disabled":false,"ellipsis":false,"mark":false,"italic":false,"underline":false,"level":1,"id":"ZeZ8ywTMVdt5bcXxawCvu","type":"title","name":"title1","label":"Title1","labelAlign":"right","parentId":"LTpAs5bjBJSvHv4nGBSJv","hidden":false,"customVisibility":null,"isDynamic":false}]}],"formSettings":{"layout":"horizontal","colon":true,"labelCol":{"span":5},"wrapperCol":{"span":13},"modelType":"{{modelType}}","_formFields":["modelType","postUrl","putUrl","deleteUrl","getUrl","layout","colon","labelCol.span","wrapperCol.span","showModeToggler"],"postUrl":"","putUrl":"","getUrl":"","showModeToggler":true}}`;

  const getMarkup = () => {
    switch (data.type) {
      case 'table':
        return tableViewMarkup;
      case 'details':
        return detailsViewMarkup;
      case 'form':
        return formMarkup;
      case 'masterDetailsPage':
        return masterDetailsMarkup;

      default:
        return blankMarkup;
    }
  };

  return {
    ...data,
    markup: getMarkup()
      ?.replaceAll('{{GEN_KEY}}', '8d2b5de9-0078-468a-8c00-5a75e9ba8e2f') // Hard-code for now
      ?.replaceAll('{{NEW_KEY}}', 'cedce9cc-3f68-4266-97e2-25b1c2e1a321') // Hard-code for now
      ?.replaceAll('{{modelType}}', data?.modelType),
  };
};
