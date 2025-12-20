import { Button } from "@/button";
import { Flex } from "@/flex";
import { Icon } from "@/icon";
import { IconButton } from "@/icon-button";
import { Input, InputGroup, InputLeftAddon } from "@/input";
import { Kbd } from "@/kbd";
import { Modal } from "@/modal";
import { MotionBox } from "@/motion";
import { Spinner } from "@/spinner";
import { Text } from "@/text";
import {
    TRANSITION_EASINGS,
    getActionKeyCode,
    useActionKey,
    useControllable,
    useEventListener,
    useUpdateEffect
} from "@dreamy-ui/react";
import { useCallback, useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { MdNavigateNext } from "react-icons/md";
import { useNavigate } from "react-router";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { capitalize } from "~/src/functions/string";
import useDebounce from "~/src/hooks/useDebounce";
import { useRoot } from "~/src/hooks/useRoot";
import { Link, type LinkProps } from "~/src/ui/global/Link";
import type { Route } from ".react-router/types/app/routes/+types/api.docs.search";

interface RecentSearch {
    filename: string;
    path: string;
    at: number;
}

export default function Search() {
    // modal controller
    const { isOpen, onClose, onToggle } = useControllable();

    // query input
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // debouncing query to match fetcher debounce time
    const [debouncedQuery, setDebouncedQuery] = useState("");
    useDebounce(() => setDebouncedQuery(query), [query], 100);

    // fetcher for fetching docs

    const fetcher = useDebounceFetcher<Route.ComponentProps["actionData"]>();

    // utilize the keyboard shortcut

    useEventListener("keydown", (e) => {
        if (e.key === "k" && e[getActionKeyCode()]) {
            e.preventDefault();
            onToggle();
        }
    });

    // recent searches

    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

    useUpdateEffect(() => {
        const recentSearches = localStorage.getItem("recentSearches");
        if (!recentSearches) return;
        setRecentSearches(JSON.parse(recentSearches));
    }, [isOpen]);

    const addRecentSearch = useCallback(
        (search: Omit<RecentSearch, "at">) => {
            const newSearch = {
                ...search,
                at: Date.now()
            } satisfies RecentSearch;
            const newRecentSearches = [newSearch, ...(recentSearches || [])].slice(0, 5);

            setRecentSearches(newRecentSearches);
            localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
        },
        [recentSearches]
    );

    // active selection
    const [active, setActive] = useState<number>(0);

    const navigate = useNavigate();
    const onKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            const results =
                (debouncedQuery.length > 0 &&
                    fetcher?.data &&
                    "docs" in fetcher.data &&
                    fetcher.data.docs) ||
                recentSearches;

            switch (e.key) {
                case "ArrowDown": {
                    e.preventDefault();
                    const newActive = active + 1;
                    if (newActive < results.length) {
                        setActive(newActive);
                    }
                    break;
                }
                case "ArrowUp": {
                    e.preventDefault();
                    const newActive = active - 1;
                    if (newActive >= 0) {
                        setActive(newActive);
                    }
                    break;
                }
                case "Control":
                    break;
                case "Alt":
                    break;
                case "Enter": {
                    if (results.length <= 0) {
                        break;
                    }
                    console.log("results[active].path", results[active].path);

                    onClose();
                    navigate(`${results[active].path}`);
                    setQuery("");
                    addRecentSearch({
                        filename: results[active].filename,
                        path: results[active].path
                    });
                    break;
                }
            }
        },
        [
            active,
            fetcher?.data,
            navigate,
            onClose,
            recentSearches,
            debouncedQuery.length,
            addRecentSearch
        ]
    );

    useUpdateEffect(() => {
        setActive(0);
    }, [fetcher?.data, recentSearches]);

    const { isMac } = useRoot();
    const actionKey = useActionKey(isMac ? "⌘" : "Ctrl");

    return (
        <>
            <Button
                _active={{
                    bg: "alpha.200"
                }}
                _hover={{
                    bg: "alpha.200"
                }}
                bg={"alpha.100"}
                boxShadow={"xs"}
                display={{
                    base: "none",
                    md: "inline-flex"
                }}
                justifyContent={"space-between"}
                leftIcon={
                    <>
                        <Icon
                            as={BiSearch}
                            boxSize={"5"}
                            color={"fg.medium"}
                        />
                        <Text
                            color={"fg.medium"}
                            fontWeight={"normal"}
                            ml={2}
                        >
                            Search...
                        </Text>
                    </>
                }
                onClick={onToggle}
                rightIcon={<Kbd size={"sm"}>{actionKey} K</Kbd>}
                variant="solid"
                w={"250px"}
            />
            <IconButton
                aria-label="Search docs"
                display={{
                    base: "inline-flex",
                    md: "none"
                }}
                icon={
                    <Icon
                        as={BiSearch}
                        boxSize={"5"}
                        color={"fg"}
                    />
                }
                onClick={onToggle}
                variant="ghost"
            />
            <Modal.Root
                initialFocusRef={inputRef}
                isOpen={isOpen}
                onClose={onClose}
                placement={"top"}
                size={"xl"}
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Body pb={2}>
                        <InputGroup w={"full"}>
                            <InputLeftAddon pl={"0.75rem!"}>
                                <Icon
                                    as={BiSearch}
                                    boxSize={"5"}
                                    color={"alpha.900"}
                                />
                            </InputLeftAddon>
                            <Input
                                aria-autocomplete="list"
                                autoComplete={"false"}
                                maxLength={100}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    if (e.target.value.length > 0)
                                        fetcher.submit(
                                            { query: e.target.value },
                                            {
                                                method: "POST",
                                                action: "/api/docs/search",
                                                debounceTimeout: 100
                                            }
                                        );
                                }}
                                onKeyDown={onKeyDown}
                                pl={12}
                                placeholder="Search docs"
                                ref={inputRef}
                                size="lg"
                                spellCheck={"false"}
                                value={query}
                                variant={"flushed"}
                                w="100%"
                            />
                        </InputGroup>

                        {fetcher.data &&
                        "docs" in fetcher.data &&
                        fetcher.data.docs.length > 0 &&
                        debouncedQuery.length > 0 ? (
                            <Flex
                                col
                                gap={2}
                                key={"docs-" + debouncedQuery}
                                opacity={fetcher.state !== "idle" ? 0.5 : 1}
                                transition={"opacity 0.2s {easings.ease-in-out"}
                            >
                                {fetcher.data.docs.map((doc, i) => {
                                    return (
                                        <SearchDoc
                                            doc={doc}
                                            id={
                                                "doc-" +
                                                doc.filename +
                                                "-" +
                                                (debouncedQuery.length > 0).toString()
                                            }
                                            isActive={active === i}
                                            key={
                                                "doc-" +
                                                doc.filename +
                                                "-" +
                                                (debouncedQuery.length > 0).toString()
                                            }
                                            onClick={() => {
                                                onClose();
                                                setQuery("");
                                                addRecentSearch({
                                                    filename: doc.filename,
                                                    path: doc.path
                                                });
                                            }}
                                            onMouseEnter={() => {
                                                setActive(i);
                                            }}
                                        />
                                    );
                                })}
                            </Flex>
                        ) : fetcher.state !== "idle" ? (
                            <Spinner
                                color={"primary"}
                                py={3}
                            />
                        ) : debouncedQuery.length > 0 ? (
                            <Text
                                color={"error"}
                                fontWeight={"semibold"}
                                py={4}
                                textAlign={"center"}
                            >
                                No results found
                            </Text>
                        ) : (
                            <Flex
                                col
                                gap={2}
                            >
                                {!recentSearches.length && (
                                    <Text
                                        fontWeight={"semibold"}
                                        py={4}
                                        textCenter
                                    >
                                        No recent searches
                                    </Text>
                                )}
                                {!!recentSearches.length && <Text>Recent searches</Text>}
                                {recentSearches.map((search, i) => {
                                    return (
                                        <SearchDoc
                                            doc={search}
                                            isActive={active === i}
                                            key={"recent-search-" + search.filename + "-" + i}
                                            onClick={() => {
                                                onClose();
                                                setQuery("");
                                            }}
                                            onMouseEnter={() => setActive(i)}
                                        />
                                    );
                                })}
                            </Flex>
                        )}
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root>
        </>
    );
}

interface SearchDocProps extends Partial<LinkProps> {
    /**
     * The doc from search or the doc from recent searches
     */
    doc: Omit<RecentSearch, "at"> | RecentSearch;
    isActive: boolean;
}

function SearchDoc({ doc, isActive, ...rest }: SearchDocProps) {
    return (
        <Link
            alignItems={"center"}
            bg={"alpha.50"}
            contentBetween
            flexbox
            gap={2}
            key={doc.filename}
            pos={"relative"}
            prefetch={isActive ? "render" : "intent"}
            px={4}
            py={3}
            rounded={"md"}
            to={doc.path}
            transition={"none"}
            w={"full"}
            {...rest}
        >
            <Flex
                col
                gap={0}
            >
                <Text
                    color={isActive ? "{colors.white/87}" : "fg"}
                    fontWeight={"semibold"}
                    transition={"color 0.15s {easings.ease-in-out}"}
                >
                    {capitalize(doc.filename)}
                </Text>
                <Text
                    color={isActive ? "{colors.white/87}" : "fg.medium"}
                    fontSize={"small"}
                    fontWeight={"normal"}
                    transition={"color 0.15s {easings.ease-in-out}"}
                >
                    {"at" in doc
                        ? new Date(doc.at).toLocaleString()
                        : capitalize(doc.path.split("/")[2])}
                </Text>
            </Flex>

            <Icon
                as={MdNavigateNext}
                color={isActive ? "{colors.white/87}" : "fg.medium"}
                boxSize={"5"}
            />

                {isActive && (
                    <MotionBox
                        bg={"primary"}
                        inset={0}
                        layout
                        layoutId="active-search-doc"
                        pos={"absolute"}
                        rounded={"md"}
                        transition={{
                            duration: 0.15,
                            ease: TRANSITION_EASINGS.easeOut
                        }}
                        zIndex={-1}
                    />
                )}
        </Link>
    );
}
