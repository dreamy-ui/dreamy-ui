export function nextTick(cb: () => any) {
    requestAnimationFrame(() => {
        requestAnimationFrame(cb);
    });
}

export async function waitTillNextTick() {
    return new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                resolve(undefined);
            });
        });
    });
}
