import { useMemo } from 'react';
import { removeZeroWidthCharsFromString } from '../..';
import { IFormSettings } from '../../providers/form/contexts';
import { evaluateKeyValuesToObjectMatchedData } from '../../providers/form/utils';

export const useSubmitUrl = (
  formSettings: IFormSettings,
  httpVerb: 'POST' | 'PUT' | 'DELETE',
  formData: any,
  parentFormValues: any,
  globalState: any
) => {
  /**
   * This function return the submit url.
   *
   * @returns
   */
  return useMemo(() => {
    const { postUrl, putUrl, deleteUrl } = formSettings || {};
    let url = postUrl; // Fallback for now

    if (httpVerb === 'POST' && postUrl) {
      url = postUrl;
    }

    if (httpVerb === 'PUT' && putUrl) {
      url = putUrl;
    }

    if (httpVerb === 'DELETE' && deleteUrl) {
      url = deleteUrl;
    }

    url = removeZeroWidthCharsFromString(url);

    url = evaluateKeyValuesToObjectMatchedData<{ url: string }>({ url }, [
      { match: 'data', data: formData },
      { match: 'parentFormValues', data: parentFormValues },
      { match: 'globalState', data: globalState },
    ])?.url;

    return url;
  }, [formSettings]);
};
