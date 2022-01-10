import { createHashHistory } from "history";
import { useTranscoders } from "./transcoder";
import { useWrappers, inWrappers, getProperty } from "./wrapper";
import { wrapWarn } from "./warn";

// Exports to remove in next major release
export { useHashParser } from "./transcoder";
export { useWrappers } from "./wrapper";
export { useParser } from "./parser";

// Type exports to remove in next major release
export type { GoAPI, ListenAPI } from "./legacy";
export type { WrapperOptions } from "./wrapper";
export type { UseParser, Parser } from "./parser";

// Types
import type { History } from "history";
import type { TranscoderOptions } from "./transcoder";
export type { TranscoderOptions } from "./transcoder";

export type HashOptions = TranscoderOptions & {
  window?: Window;
};

const useHashHistory = ({
  window = document.defaultView!,
  ...config
}: HashOptions = {}): History => {
  const core = useWrappers(useTranscoders(config));
  const windowProxy = new Proxy(window, {
    get: (_, prop) => {
      const v = getProperty(window, prop);
      return inWrappers(prop) ? core[prop](v) : v;
    },
  });
  const history = createHashHistory({ window: windowProxy });

  return new Proxy(history, {
    get: (target, prop) => {
      const v = Reflect.get(target, prop);
      return prop in
        {
          push: 1,
          replace: 1,
        }
        ? wrapWarn(v)
        : v;
    },
  });
};

export { useTranscoders, useHashHistory };
