import { useEffect } from 'react';
import { useFormGet } from '../../../../apis/form';

export const useFormMarkup = (formId: string) => {
  const { refetch, loading, error, data } = useFormGet({ lazy: true, queryParams: { id: formId } });

  useEffect(() => {
    if (formId) {
      refetch();
    }
  }, [formId]);

  return { markup: (data as any)?.result?.markup, loading, error };
};
