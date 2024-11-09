export function getRef(child: React.ReactElement) {
    if ("ref" in child.props) return child.props.ref;
    if ("ref" in child) return child.ref;
    return null;
}

type PossibleRef<T> = React.Ref<T> | undefined;

export function setRef<T>(ref: PossibleRef<T>, value: T) {
    if (typeof ref === "function") {
        ref(value);
    } else if (ref !== null && ref !== undefined) {
        (ref as React.MutableRefObject<T>).current = value;
    }
}

export function composeRefs<T>(...refs: PossibleRef<T>[]) {
    return (node: T) => {
        for (const ref of refs) {
            setRef(ref, node);
        }
    };
}
