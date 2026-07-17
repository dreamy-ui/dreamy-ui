import { Button, Flex } from "@/ui";
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" }
    ];
}

export default function Home() {
    return (
        <Flex
            align={"start"}
            col
        >
            <Button variant="primary">Dreamy UI</Button>
        </Flex>
    );
}
