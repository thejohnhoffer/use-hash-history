import { createHashHistory } from "history";

// Types
import type { To, Path, Pathname, History, Listener, Location } from "history";

export type HashOptions = {
  window?: Window;
  hashRoot?: string;
  hashSlash?: string;
};
export type Unlistener = () => void;
export type HrefAPI = (to: To) => string;
export type GoAPI = (to: To, state?: any) => void;
export type ListenAPI = (listener: Listener) => Unlistener;

export type PathRenamer = (p: Pathname) => Pathname;
export interface Pathable extends Partial<Path> {
  pathname: Pathname;
}
export type ParserOutput<T> = T extends string ? Pathable : T;
export interface Parser {
  (to: Location): ParserOutput<Location>;
  (to: To): ParserOutput<To>;
}
export interface UseParsePath {
  (list: PathRenamer[]): Parser;
}

const getPathname = (to: To): Pathname => {
  return typeof to === "string" ? to : to.pathname || "/";
};

// Replace all / with custom slashes
const useParsePath: UseParsePath = (list) => {
  const replace: PathRenamer = (pathname) => {
    return list.reduce((p, fn) => fn(p), pathname);
  };
  return (to) => {
    const pathname = replace(getPathname(to));
    return {
      ...(typeof to === "object" ? to : {}),
      pathname,
    };
  };
};

const escapeText = (s) => {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const useHashHistory = ({
  hashRoot = "",
  hashSlash = "/",
  window = document.defaultView,
}: HashOptions = {}): History => {
  const encodePathname = useParsePath([
    (t) => t.replace(/^\//, hashRoot),
    (t) => t.replace(/(?<!^)\//g, hashSlash),
    (t) => hashRoot + t.slice(hashRoot.length),
  ]);
  const escaped = escapeText(hashRoot);
  const decodePathname = useParsePath([
    (t) => t.replace(new RegExp(`^${escaped}/?`), "/"),
    (t) => t.split(hashSlash).join("/"),
  ]);

  const wrapGo = (fn: GoAPI): GoAPI => {
    return (to, state) => fn(encodePathname(to), state);
  };
  const wrapListen = (fn: ListenAPI): ListenAPI => {
    return (listener) => {
      return fn(({ action, location }) => {
        listener({
          action,
          location: decodePathname(location),
        });
      });
    };
  };

  const history = createHashHistory({ window });
  return {
    ...history,
    push: wrapGo(history.push),
    replace: wrapGo(history.replace),
    listen: wrapListen(history.listen),
  };
};

export { useParsePath, useHashHistory };
