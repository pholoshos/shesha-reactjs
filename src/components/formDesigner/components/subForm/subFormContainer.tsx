import React, { FC, Fragment } from 'react';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import DynamicComponent from '../dynamicView/dynamicComponent';

interface IDynamicConfigurableFormComponent extends IConfigurableFormComponent {
  components?: IDynamicConfigurableFormComponent[];
}

interface ISubFormContainerProps {
  components: IDynamicConfigurableFormComponent[];
}

export const SubFormContainer: FC<ISubFormContainerProps> = ({ components }) => {
  return (
    <Fragment>
      {components?.map(model => {
        return <DynamicComponent model={{ ...model, isDynamic: true }} key={model?.id} />;
      })}
    </Fragment>
  );
};
