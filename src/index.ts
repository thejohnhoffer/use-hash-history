import { createHashHistory } from "history";
import { useTranscoders } from "./transcoder";
import { useWrappers, inWrappers, getProperty } from "./wrapper";

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
  return createHashHistory({ window: windowProxy });
};

export { useTranscoders, useHashHistory };
