export function timing() {
    const start = performance.now();
    return () => {
        const end = performance.now();
        return Number((end - start).toFixed(2));
    };
}

export function stripHost(urlString: string) {
    const url = new URL(urlString);
    let str = "";
    str += url.pathname;
    str += url.search;
    str += url.hash;
    return str;
}
