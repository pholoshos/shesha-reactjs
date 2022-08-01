// For AntDesign widgets only:
import { Type } from 'react-awesome-query-builder';
import AntdConfig from 'react-awesome-query-builder/lib/config/antd';


const setTypeOperators = (type: Type, operators: string[]): Type => {
  const result = {
    ...type, 
    operators: operators
  };
  return result;
}

export const config = {
  ...AntdConfig,
  types: {
    ...AntdConfig.types,
    text: setTypeOperators(AntdConfig.types.text, [
      'equal',
      'not_equal',
      'is_empty',
      'is_not_empty',
      'like',
      'not_like',
      'starts_with',
      'ends_with',
      //"proximity"
    ])
  }
};