import { Flex } from "@/ui";
import { Heading } from "@/ui";
import { Icon } from "@/ui";
import { Text } from "@/ui";
import { useMemo } from "react";
import { LuCircleAlert } from "react-icons/lu";
import { type MetaFunction, data, isRouteErrorResponse, useRouteError } from "react-router";
import type { Route } from "./+types/$";

export function meta({ error }: Route.MetaArgs) {
    return [
        {
            title:
                typeof error === "object" &&
                error !== null &&
                "statusText" in error &&
                error.statusText
                    ? error.statusText
                    : "Dreamy UI"
        }
    ] satisfies ReturnType<MetaFunction>;
}

export async function loader(_: Route.LoaderArgs) {
    throw data(null, {
        status: 404,
        statusText: "Not found"
    });
}

export default function Component() {
    return <ErrorBoundary />;
}

export function ErrorBoundary() {
    const error = useRouteError();

    const data = useMemo(() => {
        const data = {
            title: "Not found",
            description: "The page you are looking for does not exist.",
            status: 404
        };

        if (error instanceof Response) {
            data.status = error.status;
        }

        if (error instanceof Error) {
            data.title = error.name;
            data.description = error.message;
            data.status = 500;
        }

        if (isRouteErrorResponse(error)) {
            data.title ??= error.data?.title;
            data.description ??= error.statusText;
            data.status ??= error.status;
        }

        return data;
    }, [error]);

    return (
        <Flex
            center
            col
            flex={1}
            gap={4}
            maxW={"md"}
            mb={{
                base: 0,
                md: "calc(-205px / 2)"
            }}
            mx={"auto"}
            // footer 349
            // header 144
            // 205
            w={"100%"}
        >
            <Icon
                as={LuCircleAlert}
                boxSize={"10"}
            />
            <Heading>
                {data.status} {data.title}
            </Heading>
            <Text
                color={"fg.medium"}
                textAlign={"center"}
            >
                {data.description}
            </Text>
        </Flex>
    );
}
