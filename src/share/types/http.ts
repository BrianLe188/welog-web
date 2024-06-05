export interface IHttpRequestData<T> {
    data: {
        query?: T | any;
        params?: T | any;
        body?: T | any;
    };
    errorCallbackAction?: (e?: unknown) => void;
}
