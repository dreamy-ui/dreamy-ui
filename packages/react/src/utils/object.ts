export function copyObjectWithoutKeys<T extends Record<any, any>, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> {
    const newObj = { ...obj };
    for (const key of keys) {
        delete newObj[key];
    }
    return newObj;
}

export function isObject(value: any): value is Record<string, any> {
    const type = typeof value;
    return value != null && (type === "object" || type === "function") && !Array.isArray(value);
}

export function objectToDeps(obj: Record<string, any>) {
    return Object.entries(obj).map(([key, value]) => `${key}:${value}`);
}
