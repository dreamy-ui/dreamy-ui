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
import { AnimatePresence } from "motion/react";
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
                display={{
                    base: "none",
                    md: "inline-flex"
                }}
                leftIcon={
                    <Icon
                        as={BiSearch}
                        color={"alpha.900"}
                        boxSize={"5"}
                    />
                }
                onClick={onToggle}
                variant="ghost"
                rightIcon={<Kbd size={"sm"}>{actionKey} K</Kbd>}
            >
                Search docs
            </Button>
            <IconButton
                aria-label="Search docs"
                icon={
                    <Icon
                        as={BiSearch}
                        color={"alpha.900"}
                        boxSize={"5"}
                    />
                }
                onClick={onToggle}
                variant="ghost"
                display={{
                    base: "inline-flex",
                    md: "none"
                }}
            />
            <Modal.Root
                isOpen={isOpen}
                onClose={onClose}
                size={"xl"}
                initialFocusRef={inputRef}
                placement={"top"}
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Body pb={2}>
                        <InputGroup w={"full"}>
                            <InputLeftAddon pl={"0.75rem!"}>
                                <Icon
                                    as={BiSearch}
                                    color={"alpha.900"}
                                    boxSize={"5"}
                                />
                            </InputLeftAddon>
                            <Input
                                pl={12}
                                value={query}
                                onKeyDown={onKeyDown}
                                ref={inputRef}
                                placeholder="Search docs"
                                w="100%"
                                size="lg"
                                variant={"flushed"}
                                spellCheck={"false"}
                                maxLength={100}
                                aria-autocomplete="list"
                                autoComplete={"false"}
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
                            />
                        </InputGroup>

                        {fetcher.data &&
                        "docs" in fetcher.data &&
                        fetcher.data.docs.length > 0 &&
                        debouncedQuery.length > 0 ? (
                            <Flex
                                opacity={fetcher.state !== "idle" ? 0.5 : 1}
                                transition={"opacity 0.2s {easings.ease-in-out"}
                                col
                                gap={2}
                                key={"docs-" + debouncedQuery}
                            >
                                {fetcher.data.docs.map((doc, i) => {
                                    return (
                                        <SearchDoc
                                            key={
                                                "doc-" +
                                                doc.filename +
                                                "-" +
                                                (debouncedQuery.length > 0).toString()
                                            }
                                            id={
                                                "doc-" +
                                                doc.filename +
                                                "-" +
                                                (debouncedQuery.length > 0).toString()
                                            }
                                            doc={doc}
                                            isActive={active === i}
                                            onMouseEnter={() => {
                                                setActive(i);
                                            }}
                                            onClick={() => {
                                                onClose();
                                                setQuery("");
                                                addRecentSearch({
                                                    filename: doc.filename,
                                                    path: doc.path
                                                });
                                            }}
                                        />
                                    );
                                })}
                            </Flex>
                        ) : fetcher.state !== "idle" ? (
                            <Spinner
                                py={3}
                                color={"primary"}
                            />
                        ) : debouncedQuery.length > 0 ? (
                            <Text
                                color={"error"}
                                fontWeight={"semibold"}
                                textAlign={"center"}
                                py={4}
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
                                        textCenter
                                        fontWeight={"semibold"}
                                        py={4}
                                    >
                                        No recent searches
                                    </Text>
                                )}
                                {!!recentSearches.length && <Text>Recent searches</Text>}
                                {recentSearches.map((search, i) => {
                                    return (
                                        <SearchDoc
                                            key={"recent-search-" + search.filename + "-" + i}
                                            doc={search}
                                            isActive={active === i}
                                            onMouseEnter={() => setActive(i)}
                                            onClick={() => {
                                                onClose();
                                                setQuery("");
                                            }}
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
            flexbox
            key={doc.filename}
            gap={2}
            contentBetween
            alignItems={"center"}
            w={"full"}
            rounded={"md"}
            to={doc.path}
            bg={"alpha.50"}
            px={4}
            py={3}
            prefetch={isActive ? "render" : "intent"}
            transition={"none"}
            pos={"relative"}
            {...rest}
        >
            <Flex
                col
                gap={0}
            >
                <Text
                    fontWeight={"semibold"}
                    color={isActive ? "{colors.white/87}" : "fg"}
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
                boxSize={"5"}
            />

            <AnimatePresence>
                {isActive && (
                    <MotionBox
                        pos={"absolute"}
                        inset={0}
                        bg={"primary"}
                        zIndex={-1}
                        rounded={"md"}
                        layout
                        layoutId="active-search-doc"
                        transition={{
                            duration: 0.15,
                            ease: TRANSITION_EASINGS.easeOut
                        }}
                    />
                )}
            </AnimatePresence>
        </Link>
    );
}
