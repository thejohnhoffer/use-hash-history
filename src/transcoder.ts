import type { Parser } from "./wrapper";

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

const useParser = (list: Parser[]) => {
  const parser = (hash: string): string => {
    return list.reduce((p, fn) => fn(p), hash);
  };
  return parser;
};

const useTranscoders = ({
  hashRoot = "",
  hashSlash = "/",
}: TranscoderOptions) => {
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

export { useParser as _useParser };
export { useTranscoders };
