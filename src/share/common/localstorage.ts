export function setItem(key: string, value: string | object) {
    window.localStorage.setItem(
        key,
        typeof value === "string" ? value : JSON.stringify(value),
    );
}

export function getItem(key: string) {
    const value = window.localStorage.getItem(key);

    if (value) {
        try {
            return JSON.parse(value);
        } catch (error) {
            return value;
        }
    }

    return null;
}
