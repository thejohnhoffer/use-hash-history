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
}: TranscoderOptions) => {
  return {
    encode: (t: string) => {
      return transcoder(["/", hashRoot], ["/", hashSlash], t);
    },
    decode: (t: string) => {
      return transcoder([hashRoot, "/"], [hashSlash, "/"], t);
    },
  };
};

export { useTranscoders };
