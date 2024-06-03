export interface IHttpRequestData<T> {
    data: {
        query?: T;
        params?: T;
        body?: T;
    };
    errorCallbackAction?: (e?: unknown) => void;
}
