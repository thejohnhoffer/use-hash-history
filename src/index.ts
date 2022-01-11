import { createHashHistory } from "history";
import { useTranscoders } from "./transcoder";
import { useWrapper, inWrapper, getProperty } from "./wrapper";

import type { History } from "history";

export type HashOptions = {
  window?: Window;
  hashRoot?: string;
  hashSlash?: string;
};

const useHashHistory = ({
  window = document.defaultView!,
  ...config
}: HashOptions = {}): History => {
  const core = useWrapper(useTranscoders(config));
  const windowProxy = new Proxy(window, {
    get: (_, prop) => {
      const v = getProperty(window, prop);
      return inWrapper(prop) ? core[prop](v) : v;
    },
  });
  return createHashHistory({ window: windowProxy });
};

export { useTranscoders, useHashHistory };
