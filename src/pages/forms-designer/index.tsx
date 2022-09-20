import React from 'react';
import { resetServerContext } from 'react-beautiful-dnd';
import { FormIdentifier } from '../../providers/form/models';
import { PageWithLayout } from '../../interfaces';
import { FormProvider } from '../../providers';
import { FormDesigner } from '../../components';

export interface IDesignerPageProps {
    formId: FormIdentifier;
}

const DesignerPage: PageWithLayout<IDesignerPageProps> = props => {
    return (
        <FormProvider mode="designer" formId={props.formId}>
            <FormDesigner />
        </FormProvider>
    );
}

DesignerPage["getInitialProps"] = async () => {
    resetServerContext(); // required for Drag&Drop
  
    return {};
  };

export default DesignerPage;