interface Redirect {
    path: string;
    redirect: string;
}

export default [
    {
        path: "/discord",
        redirect: "https://discord.gg/gTSuFWnWy8"
    }
] satisfies Redirect[];
