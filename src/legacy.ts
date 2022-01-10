import { createPath } from "history";

// Types
import type { To, Update, Listener } from "history";
import type { Parser } from "./parser";

export interface GoAPI {
  (to: To, state?: any): void;
}
export interface ListenAPI {
  (listener: Listener): () => void;
}

const useOldWrappers = ({
  encode,
  decode,
}: {
  encode: Parser;
  decode: Parser;
}) => {
  return {
    wrapGo: (fn: GoAPI): GoAPI => {
      return (to, state) => {
        const pathname = typeof to === "string" ? to : createPath(to);
        return fn(encode(pathname), state);
      };
    },
    wrapListen: (fn: ListenAPI): ListenAPI => {
      return (listener) => {
        return fn(({ action, location }: Update) => {
          listener({
            action,
            location: {
              ...location,
              pathname: decode(location.pathname),
            },
          });
        });
      };
    },
  };
};

export { useOldWrappers };
