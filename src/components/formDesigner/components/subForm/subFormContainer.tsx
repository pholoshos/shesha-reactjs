import React, { FC, Fragment } from 'react';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import DynamicComponent from '../dynamicView/dynamicComponent';

interface IDynamicConfigurableFormComponent extends IConfigurableFormComponent {
  components?: IDynamicConfigurableFormComponent[];
}

interface ISubFormContainerProps {
  components: IDynamicConfigurableFormComponent[];
}

// sub-form

export const SubFormContainer: FC<ISubFormContainerProps> = ({ components }) => {
  console.log('LOGS:: SubFormContainer components', components);

  return (
    <Fragment>
      {components?.map(model => {
        if (model.type === 'container' && model?.components?.length) {
          return (
            <div
              className="sha-sub-form-container"
              style={{
                display: 'flex',
                flexDirection: (model as any)?.direction === 'vertical' ? 'column' : 'row',
                justifyContent: (model as any)?.justifyContent,
                alignItems: (model as any)?.alignItems,
                justifyItems: (model as any)?.justifyItems,
              }}
            >
              <SubFormContainer components={model?.components} />
            </div>
          );
        }

        return <DynamicComponent model={model} />;
      })}
    </Fragment>
  );
};
