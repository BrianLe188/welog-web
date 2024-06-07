import { request } from "@/share/services";
import { IHttpRequestData } from "@/share/types/http";
import { ITodo } from "@/share/types/timeline";

export async function createTodo<T>({
    data,
    errorCallbackAction,
}: IHttpRequestData<T>) {
    try {
        const res = await request().post("/todos", data.body);

        if (res) return res.data as ITodo;
    } catch (error) {
        errorCallbackAction && errorCallbackAction(error);
    }
}

export async function removeTodo<T extends { id: string }>({
    data,
    errorCallbackAction,
}: IHttpRequestData<T>) {
    try {
        await request().delete(`/todos/${data.params?.id}`);
    } catch (error) {
        errorCallbackAction && errorCallbackAction(error);
    }
}

export async function updateTodo<T>({
    data,
    errorCallbackAction,
}: IHttpRequestData<T>) {
    try {
        const res = await request().put(`/todos/${data.params?.id}`, data.body);

        if (res) return res.data;
    } catch (error) {
        errorCallbackAction && errorCallbackAction(error);
    }
}

export async function updateTodoByKey<T>({
    data,
    errorCallbackAction,
}: IHttpRequestData<T>) {
    try {
        const res = await request().patch(
            `/todos/${data.params?.id}`,
            data.body,
        );

        if (res) return res.data;
    } catch (error) {
        errorCallbackAction && errorCallbackAction(error);
    }
}

export async function reOrderTodo<T>({
    data,
    errorCallbackAction,
}: IHttpRequestData<T>) {
    try {
        const res = await request().patch(
            `/todos/${data.params?.id}/re-order`,
            data.body,
        );

        if (res) return res.data;
    } catch (error) {
        errorCallbackAction && errorCallbackAction(error);
    }
}
