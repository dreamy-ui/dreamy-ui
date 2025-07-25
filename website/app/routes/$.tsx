import { Flex, Heading, Icon, Text } from "@dreamy-ui/react/rsc";
import type { LoaderFunctionArgs } from "react-router";
import {
    type MetaArgs,
    type MetaFunction,
    data,
    isRouteErrorResponse,
    useRouteError,
} from "react-router";
import { useMemo } from "react";
import { LuCircleAlert } from "react-icons/lu";

export function meta({ error }: MetaArgs<typeof loader>) {
    console.log("error", error);

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

export async function loader(_: LoaderFunctionArgs) {
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
            w={"100%"}
            maxW={"md"}
            mx={"auto"}
            flex={1}
            center
            col
            gap={4}
            // footer 349
            // header 144
            // 205
            mb={{
                base: 0,
                md: "calc(-205px / 2)"
            }}
        >
            <Icon
                boxSize={"10"}
                as={LuCircleAlert}
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
