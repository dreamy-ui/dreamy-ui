import { Button, Pagination } from "@/ui";
import { useState } from "react";

export function ControlledPagination() {
    const [page, setPage] = useState(1);

    return (
        <Pagination.Root
            count={100}
            onPageChange={(details) => setPage(details.page)}
            page={page}
            pageSize={10}
        >
            <Pagination.PrevTrigger />
            <Pagination.Items />
            <Pagination.NextTrigger />
            <Pagination.PageText
                format="compact"
                ml={4}
            />
        </Pagination.Root>
    );
}

export function CustomItemPagination() {
    return (
        <Pagination.Root
            count={200}
            defaultPage={5}
            pageSize={10}
        >
            <Pagination.PrevTrigger />
            <Pagination.Items
                render={(page) => (
                    <Button
                        _selected={{
                            bg: "primary.500",
                            color: "primary.fg"
                        }}
                        variant="ghost"
                    >
                        Page {page.value}
                    </Button>
                )}
            />
            <Pagination.NextTrigger />
        </Pagination.Root>
    );
}
