import { request } from "@/share/services";
import { IHttpRequestData } from "@/share/types/http";
import qs from "query-string";

export async function register<T>({
    data,
    errorCallbackAction,
    successCallbackAction,
}: IHttpRequestData<T>) {
    try {
        const res = await request().post("/auth/register", data.body);

        if (res) {
            if (successCallbackAction) {
                successCallbackAction(res.data);
            } else {
                return res.data;
            }
        }
    } catch (error) {
        errorCallbackAction && errorCallbackAction(error);
    }
}

export async function login<T>({
    data,
    errorCallbackAction,
    successCallbackAction,
}: IHttpRequestData<T>) {
    try {
        const res = await request().get(
            `/auth/login?${data?.query ? qs.stringify(data.query) : ""}`,
        );

        if (res) {
            if (successCallbackAction) {
                successCallbackAction(res.data);
            } else {
                return res.data;
            }
        }
    } catch (error) {
        errorCallbackAction && errorCallbackAction(error);
    }
}
