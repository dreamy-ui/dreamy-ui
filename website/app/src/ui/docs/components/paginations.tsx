import { Button, Pagination } from "@/ui";
import { useState } from "react";

export function ControlledPagination() {
    const [page, setPage] = useState(1);

    return (
        <Pagination.Root
            onPageChange={(nextPage) => setPage(nextPage)}
            page={page}
            pageSize={10}
            total={100}
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
            defaultPage={5}
            pageSize={10}
            total={200}
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
                        Page {page}
                    </Button>
                )}
            />
            <Pagination.NextTrigger />
        </Pagination.Root>
    );
}
