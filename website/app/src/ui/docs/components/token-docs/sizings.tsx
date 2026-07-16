import { sizings } from "./query";
import { TokenTable } from "./shared";

export function TokenSizings() {
    return <TokenTable rows={sizings} />;
}
