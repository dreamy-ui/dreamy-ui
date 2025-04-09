interface Redirect {
    path: string | string[];
    redirect: string;
}

export default [
    {
        path: ["/discord", "/help", "/support", "/contact"],
        redirect: "https://discord.gg/gTSuFWnWy8"
    },
    {
        path: "/sponsor",
        redirect: "https://github.com/sponsors/ImExoOdeex"
    }
] satisfies Redirect[];
