import _ from 'lodash';
import { useEffect } from 'react';
import { useGet } from 'restful-react';
import { IAnyObject } from '../../interfaces';
import { useForm, useGlobalState, useSheshaApplication } from '../../providers';
import { evaluateKeyValuesToObjectMatchedData } from '../../providers/form/utils';
import { getQueryParams } from '../../utils/url';

/**
 * A hook for fetching the form entity
 * @param parentFormValues parent form values to use to create query parameters
 * @returns formEntity
 */
export const useFormEntity = (parentFormValues: any, skipFetchData: boolean) => {
  const { globalState } = useGlobalState();
  const { formData, formSettings } = useForm();
  const { backendUrl } = useSheshaApplication();

  const { refetch: fetchEntity, error: fetchEntityError, data: fetchedEntity } = useGet({
    path: formSettings?.getUrl || '',
    lazy: true,
  });

  useEffect(() => {
    if (skipFetchData) {
      return;
    }
    const getUrl = formSettings?.getUrl;
    if (formSettings && getUrl) {
      const fullUrl = `${backendUrl}${getUrl}`;
      const urlObj = new URL(decodeURIComponent(fullUrl));
      const rawQueryParamsToBeEvaluated = getQueryParams(fullUrl);
      const queryParamsFromAddressBar = getQueryParams();

      let queryParams: IAnyObject;

      if (fullUrl?.includes('?')) {
        if (fullUrl?.includes('{{')) {
          queryParams = evaluateKeyValuesToObjectMatchedData(rawQueryParamsToBeEvaluated, [
            { match: 'data', data: formData },
            { match: 'parentFormValues', data: parentFormValues },
            { match: 'globalState', data: globalState },
            { match: 'query', data: queryParamsFromAddressBar },
          ]);
        } else {
          queryParams = rawQueryParamsToBeEvaluated;
        }
      }

      if (getUrl && !_.isEmpty(queryParams)) {
        if (Object.hasOwn(queryParams, 'id') && !Boolean(queryParams['id'])) {
          console.error('id cannot be null');
          return;
        }

        fetchEntity({
          queryParams,
          path: urlObj?.pathname,
          base: urlObj?.origin,
        });
      }
    }
  }, [formSettings]);

  if (fetchEntityError) {
    return new Error(fetchEntityError?.message ?? fetchEntityError?.data);
  }

  return fetchedEntity?.result;
};
