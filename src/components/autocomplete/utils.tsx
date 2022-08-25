import qs from "qs";

export const getQueryString = (url: string) => {
    const idx = url?.indexOf('?') || -1;
    if (idx === -1) return {};

    const queryString = url.substr(idx);
    return qs.parse(queryString, { ignoreQueryPrefix: true });
};

export const trimQueryString = (url: string): string => {
    if (!url) return url;
    const idx = url.indexOf('?');
    return idx > -1 ? url.substr(0, idx) : url;
};