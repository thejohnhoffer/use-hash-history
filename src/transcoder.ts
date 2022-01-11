const split = (oldRoot: string, newRoot: string, input: string) => {
  const restIndex = input.indexOf(oldRoot) + oldRoot.length;
  const first = input.substring(0, restIndex);
  const isRelative = input.match(/^\.\.\//);
  const rest = input.substring(restIndex);
  return [isRelative ? first : newRoot, rest];
};

const transcoder = (oldRoot: string, newRoot: string) => {
  return (oldSlash: string, newSlash: string) => {
    return (input: string) => {
      const [prefix, rest] = split(oldRoot, newRoot, input);
      return prefix + rest.replaceAll(oldSlash, newSlash);
    };
  };
};

const useTranscoders = ({ hashRoot = "", hashSlash = "/" }) => {
  return {
    encode: transcoder("/", hashRoot)("/", hashSlash),
    decode: transcoder(hashRoot, "/")(hashSlash, "/"),
  };
};

export { useTranscoders };
