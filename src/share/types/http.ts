export interface IHttpRequestData<T> {
    data: {
        query?: T | unknown;
        params?: T | unknown;
        body?: T | unknown;
    };
    errorCallbackAction?: (e?: unknown) => void;
    successCallbackAction?: (e?: unknown) => void;
}
