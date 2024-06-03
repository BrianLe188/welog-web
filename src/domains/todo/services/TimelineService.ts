import { request } from "@/share/services";
import { IHttpRequestData } from "@/share/types/http";
import { ITimeline } from "@/share/types/timeline";
import qs from "query-string";

export async function createTimeline<T>({
    data,
    errorCallbackAction,
}: IHttpRequestData<T>) {
    try {
        const res = await request().post("/timelines", data.body);

        if (res) return res.data as ITimeline;
    } catch (error) {
        errorCallbackAction && errorCallbackAction(error);
    }
}

export async function getTimelines<T>({
    data,
    errorCallbackAction,
}: IHttpRequestData<T>) {
    try {
        const res = await request().get(
            `/timelines?${data?.query ? qs.stringify(data.query) : ""}`,
        );

        if (res) return res.data as ITimeline[];
    } catch (error) {
        errorCallbackAction && errorCallbackAction(error);
    }
}
