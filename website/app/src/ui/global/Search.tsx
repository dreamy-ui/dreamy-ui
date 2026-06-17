import { Button } from "@/ui";
import { Flex } from "@/ui";
import { Icon } from "@/ui";
import { IconButton } from "@/ui";
import { Input, InputGroup, InputLeftAddon } from "@/ui";
import { Kbd } from "@/ui";
import { Modal } from "@/ui";
import { MotionBox } from "@/ui";
import { Spinner } from "@/ui";
import { Text } from "@/ui";
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
import type { DocSearchResult } from "~/src/.server/docs";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import useDebounce from "~/src/hooks/useDebounce";
import { useRoot } from "~/src/hooks/useRoot";
import { Link, type LinkProps } from "~/src/ui/global/Link";

interface SearchActionData {
    docs?: DocSearchResult[];
    error?: string;
}

interface RecentSearch {
    title: string;
    description?: string | null;
    sectionTitle?: string;
    path: string;
    at: number;
}

interface SearchDocItem {
    title: string;
    description?: string | null;
    sectionTitle?: string;
    path: string;
}

export default function Search() {
    const { isOpen, onClose, onToggle } = useControllable();

    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const [debouncedQuery, setDebouncedQuery] = useState("");
    useDebounce(() => setDebouncedQuery(query), [query], 100);

    const fetcher = useDebounceFetcher<SearchActionData>();

    useEventListener("keydown", (e) => {
        if (e.key === "k" && e[getActionKeyCode()]) {
            e.preventDefault();
            onToggle();
        }
    });

    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

    useUpdateEffect(() => {
        const stored = localStorage.getItem("recentSearches");
        if (!stored) return;
        setRecentSearches(JSON.parse(stored));
    }, [isOpen]);

    const addRecentSearch = useCallback(
        (search: SearchDocItem) => {
            const newSearch = {
                ...search,
                at: Date.now()
            } satisfies RecentSearch;
            const newRecentSearches = [
                newSearch,
                ...(recentSearches || []).filter((item) => item.path !== search.path)
            ].slice(0, 5);

            setRecentSearches(newRecentSearches);
            localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
        },
        [recentSearches]
    );

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
                        title: results[active].title,
                        description: results[active].description,
                        sectionTitle: results[active].sectionTitle,
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
                                {fetcher.data.docs.map((doc: DocSearchResult, i: number) => {
                                    return (
                                        <SearchDoc
                                            doc={doc}
                                            id={"doc-" + doc.path + "-" + debouncedQuery}
                                            isActive={active === i}
                                            key={"doc-" + doc.path + "-" + debouncedQuery}
                                            onClick={() => {
                                                onClose();
                                                setQuery("");
                                                addRecentSearch({
                                                    title: doc.title,
                                                    description: doc.description,
                                                    sectionTitle: doc.sectionTitle,
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
                                            isRecent
                                            key={"recent-search-" + search.path + "-" + i}
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
    doc: SearchDocItem | RecentSearch;
    isActive: boolean;
    isRecent?: boolean;
}

function SearchDoc({ doc, isActive, isRecent, ...rest }: SearchDocProps) {
    const subtitle = isRecent
        ? new Date((doc as RecentSearch).at).toLocaleString()
        : doc.description || doc.sectionTitle;

    return (
        <Link
            alignItems={"center"}
            bg={"alpha.50"}
            contentBetween
            flexbox
            gap={2}
            key={doc.path}
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
                minW={0}
            >
                <Text
                    color={isActive ? "{colors.white/87}" : "fg"}
                    fontWeight={"semibold"}
                    transition={"color 0.15s {easings.ease-in-out}"}
                >
                    {doc.title}
                </Text>
                <Text
                    color={isActive ? "{colors.white/87}" : "fg.medium"}
                    css={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}
                    fontSize={"small"}
                    fontWeight={"normal"}
                    transition={"color 0.15s {easings.ease-in-out}"}
                >
                    {subtitle}
                </Text>
            </Flex>

            <Icon
                as={MdNavigateNext}
                boxSize={"5"}
                color={isActive ? "{colors.white/87}" : "fg.medium"}
                flexShrink={0}
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
