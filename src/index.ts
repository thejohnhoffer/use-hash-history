import { createHashHistory, createPath } from "history";

// Types
import type {
  To,
  Path,
  Hash,
  Pathname,
  Update,
  History,
  Listener,
  Location,
} from "history";

type VoidFn = () => void;
type PathRenamer = (p: Pathname) => Pathname;
type Hashable = Partial<Location> & { hash: Hash };
type Pathable = Partial<Path> & { pathname: Pathname };
export interface Parser {
  (to: Location): Location;
  (to: To): Pathable;
}
export interface UseParser {
  (list: PathRenamer[]): Parser;
}
export interface GoAPI {
  (to: To, state?: any): void;
}
export interface ListenAPI {
  (listener: Listener): VoidFn;
}

export type WrapperOptions = {
  decode: Parser;
  encode: Parser;
};

export type TranscoderOptions = {
  hashRoot?: string;
  hashSlash?: string;
};

export type HashOptions = TranscoderOptions & {
  window?: Window;
};

const createHref = (to: To | Location): Pathname => {
  return typeof to === "string" ? to : createPath(to);
};

const isLocation = (to: To | Location): to is Location => {
  const { key = null } = {
    ...(typeof to === "object" ? to : {}),
  };
  return key !== null;
};

// Replace all / with custom slashes
const useParser: UseParser = (list) => {
  const replace: PathRenamer = (pathname) => {
    return list.reduce((p, fn) => fn(p), pathname);
  };
  function parser(to: Location): Location;
  function parser(to: To): Pathable;
  function parser(to: To | Location) {
    const pathname = replace(createHref(to));
    return !isLocation(to)
      ? { pathname }
      : {
          pathname,
          key: to.key,
          state: to.state,
          search: "",
          hash: "",
        };
  }
  return parser;
};

const escapeText = (s: string) => {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const useTranscoders = ({
  hashRoot = "",
  hashSlash = "/",
}: TranscoderOptions): WrapperOptions => {
  const encode = useParser([
    (t) => t.replace(/^\//, ""),
    (t) => hashRoot + t.replace(/\//g, hashSlash),
    (t) => t.replace(/^\/\.\./g, ".."),
  ]);
  const escaped = escapeText(hashRoot);
  const decode = useParser([
    (t) => t.replace(new RegExp(`^${escaped}/?`), "/"),
    (t) => t.split(hashSlash).join("/"),
  ]);

  return {
    encode,
    decode,
  };
};

const useWarnWrapper = (c: Console) => {
  const w = c.warn;
  return (fn: VoidFn) => {
    c.warn = new Proxy(w, { apply: () => null });
    c.warn = ((_) => w)(fn());
  };
};

const useWrappers = ({ encode, decode }: WrapperOptions) => {
  return {
    wrapGo: (fn: GoAPI): GoAPI => {
      return (to, state) => {
        return fn(encode(to), state);
      };
    },
    wrapListen: (fn: ListenAPI): ListenAPI => {
      return (listener) => {
        return fn(({ action, location }: Update) => {
          listener({
            action,
            location: decode(location),
          });
        });
      };
    },
  };
};

const useHashHistory = ({
  window = document.defaultView!,
  ...config
}: HashOptions = {}): History => {
  const core = useWrappers(useTranscoders(config));
  const history = createHashHistory({ window });
  const wrapGo = new Proxy(core.wrapGo, {
    apply: (go, _, [fn]) => {
      return go((to, state) => {
        useWarnWrapper(console)(() => fn(to, state));
      });
    },
  });

  return new Proxy(history, {
    get: (target, prop, _) => {
      switch (prop) {
        case "push":
          return wrapGo(target.push);
        case "replace":
          return wrapGo(target.replace);
        case "listen":
          return core.wrapListen(target.listen);
        default:
          return Reflect.get(target, prop, _);
      }
    },
  });
};

const useHashParser = (options: TranscoderOptions) => {
  const { decode } = useTranscoders(options);
  return (path: Hashable) => {
    return decode(path.hash.slice(1));
  };
};

export {
  useParser,
  useWrappers,
  useTranscoders,
  useHashHistory,
  useHashParser,
};
