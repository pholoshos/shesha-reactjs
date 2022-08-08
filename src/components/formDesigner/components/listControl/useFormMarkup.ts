import { useEffect } from 'react';
import { useFormGet } from '../../../../apis/form';

export const useFormMarkup = (formId: string) => {
  const { refetch, loading, error, data } = useFormGet({ lazy: true, id: formId });

  useEffect(() => {
    if (formId) {
      refetch();
    }
  }, [formId]);

  return { markup: data?.result?.markup, loading, error };
};
