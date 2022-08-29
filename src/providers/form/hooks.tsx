import { useEffect, useState } from 'react';
import { useFormGet } from '../../apis/form';
import { FormMarkupWithSettings } from './models';

export const useFormMarkup = (formId: string, lazy = false) => {
  const [markup, setMarkup] = useState<FormMarkupWithSettings>();

  const { refetch, loading, data: fetchFormResponse, error } = useFormGet({
    queryParams: { id: formId },
    lazy,
  });

  useEffect(() => {
    if (formId && !lazy) {
      refetch();
    }
  }, [formId]);

  useEffect(() => {
    if (!loading && fetchFormResponse) {
      const result = (fetchFormResponse as any)?.result;

      const markup = result?.markup;

      if (markup) {
        setMarkup(JSON.parse(markup));
      }
    }
  }, [fetchFormResponse, loading]);

  return {
    refetch,
    loading,
    markup,
    error,
  };
};
