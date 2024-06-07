import axios from "axios";

const baseURL =
    import.meta.env.WELOG_HTTP_URL || "http://localhost:3000/api/v1";

const WelogHttp = axios.create({
    baseURL,
});

export function request() {
    return WelogHttp;
}
