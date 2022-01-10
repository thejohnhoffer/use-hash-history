import { parsePath, createPath } from "history";

// Types
import type { Parser } from "./parser";

export type WrapperOptions = {
  decode: Parser;
  encode: Parser;
};

type StateArgs = [any, string, (URL | string)?];
type StateFunction = (..._: StateArgs) => unknown;
type Scope = Partial<Omit<Window, number> & History>;

// Old wrappers to remove in next major release
import { useOldWrappers } from "./legacy";

const parse = (fn: Parser, s = "") => {
  return `#${fn(s.slice(1))}`;
};

const getProperty = (scope: Scope, k: string | symbol) => {
  const v = scope[k as keyof Scope];
  return typeof v === "function" ? v.bind(scope) : v;
};

type ProxyCore = "history" | "location";
function inWrappers(x: string | symbol): x is ProxyCore {
  return (
    x in
    {
      history: 1,
      location: 1,
    }
  );
}

function inHistoryWrapper(x: string | symbol): boolean {
  return (
    x in
    {
      pushState: 1,
      replaceState: 1,
    }
  );
}

const makeArgsEncoder = (encode: Parser) => {
  return (fn: StateFunction) => {
    return (...[_s, _t, url]: StateArgs) => {
      const path = parsePath((url || "").toString());
      const hash = parse(encode, path.hash);
      return fn(_s, _t, createPath({ ...path, hash }));
    };
  };
};

const useWrappers = ({ encode, decode }: WrapperOptions) => {
  const encodeArgs = makeArgsEncoder(encode);

  return {
    ...useOldWrappers({ encode, decode }),
    history: (globalHistory: History): History => {
      return new Proxy(globalHistory, {
        get: (_, prop) => {
          const v = getProperty(globalHistory, prop);
          return inHistoryWrapper(prop) ? encodeArgs(v) : v;
        },
      });
    },
    location: (location: Location): Location => {
      return {
        ...location,
        hash: parse(decode, location.hash),
      };
    },
  };
};

export { useWrappers, inWrappers, getProperty };
