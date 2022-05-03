export const getCurrentUrl = (): string => {
  return typeof window !== 'undefined' ? window.location?.pathname ?? '' : '';
};

export const getCurrentQueryString = (): string => {
  return typeof window !== 'undefined' ? window.location?.search ?? '' : '';
};

export const getCurrentUrlWithQueryString = (): string => {
  return getCurrentUrl() + getCurrentQueryString();
};

export const normalizeUrl = (url: string): string => {
  return url === '/' ? url : (url ?? '').endsWith('/') ? (url || '').substring(0, url.length - 1) : url;
};

export const isSameUrls = (url1: string, url2: string): boolean => {
  return normalizeUrl(url1) === normalizeUrl(url2);
};

export const getLoginUrlWithReturn = (landingPage: string, unauthorizedRedirectUrl: string) => {
  const currentPath = getCurrentUrl();

  const redirectUrl =
    isSameUrls(currentPath, landingPage) || isSameUrls(currentPath, unauthorizedRedirectUrl)
      ? ''
      : `/?returnUrl=${encodeURIComponent(getCurrentUrlWithQueryString())}`;

  return `${unauthorizedRedirectUrl}${redirectUrl}`;
};

export interface QueryStringParams {
  [key: string]: string | number;
}

export const getQueryParams = (url?: string): QueryStringParams => {
  const search = url ? new URL(decodeURIComponent(url)).search : getCurrentQueryString();

  const urlSearchParams = new URLSearchParams(search ?? '');
  const params = Object.fromEntries(urlSearchParams.entries()) as QueryStringParams;

  Object.keys(params).forEach(key => {
    if (!isNaN(Number(params[key]))) {
      params[key] = Number(params[key]);
    }
  });

  return params;
};

export const getQueryParam = (name: string) => {
  const result = getQueryParams()[name];

  return result;
};

export const getUrlWithoutQueryParams = (url: string) => {
  const urlObj = new URL(decodeURIComponent(url));

  return `${urlObj?.host}${urlObj?.pathname}`;
};
