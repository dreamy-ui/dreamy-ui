import { Flex, Heading, Icon, Text } from "@dreamy-ui/react/rsc";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { type MetaFunction, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { useMemo } from "react";
import { LuAlertCircle } from "react-icons/lu";

export function meta() {
    return [
        {
            title: "Dreamy UI"
        }
    ] satisfies ReturnType<MetaFunction>;
}

export async function loader(_: LoaderFunctionArgs) {
    return new Response("Not found", {
        status: 404
    });
}

export default function () {
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
            w={"100%"}
            maxW={"md"}
            mx={"auto"}
            flex={1}
            center
            col
            gap={4}
            mb={{
                base: 10,
                md: 36
            }}
        >
            <Icon
                boxSize={"10"}
                as={LuAlertCircle}
            />
            <Heading>
                {data.status} {data.title}
            </Heading>
            <Text textAlign={"center"}>{data.description}</Text>
        </Flex>
    );
}
