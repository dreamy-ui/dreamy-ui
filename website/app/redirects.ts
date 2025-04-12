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
    },
    {
        path: ["/source", "/github"],
        redirect: "https://github.com/dreamy-ui/dreamy-ui"
    },
    {
        path: ["/bluesky"],
        redirect: "https://bsky.app/profile/dreamy-ui.com"
    }
] satisfies Redirect[];
