import { useParser } from "./parser";

// Types
import type { WrapperOptions } from "./wrapper";

type Pair = [string, string];

export type TranscoderOptions = {
  hashRoot?: string;
  hashSlash?: string;
};

const transcoder = (root: Pair, slash: Pair, input: string) => {
  const rest = input.substring(input.indexOf(root[0]) + root[0].length);
  const prefix = input.match(/^\.\.\//) ? input.split(rest)[0] : root[1];
  return prefix + rest.replaceAll(...slash);
};

const useTranscoders = ({
  hashRoot = "",
  hashSlash = "/",
}: TranscoderOptions): WrapperOptions => {
  const encode = useParser([
    (t) => transcoder(["/", hashRoot], ["/", hashSlash], t),
  ]);
  const decode = useParser([
    (t) => transcoder([hashRoot, "/"], [hashSlash, "/"], t),
  ]);

  return {
    encode,
    decode,
  };
};

export { useTranscoders };