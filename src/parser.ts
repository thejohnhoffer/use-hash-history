// Types
type Renamer = (s: string) => string;

export interface Parser {
  (to: string): string;
}
export interface UseParser {
  (list: Renamer[]): Parser;
}

// Replace all / with custom slashes
const useParser: UseParser = (list) => {
  const parser = (hash: string): string => {
    return list.reduce((p, fn) => fn(p), hash);
  };
  return parser;
};

export { useParser };
