type F = (..._: any[]) => unknown;

const wrapWarn = (fn: F): F => {
  return (..._) => {
    const w = console.warn;
    const hide = { apply: () => null };
    console.warn = new Proxy(w, hide);
    const output = fn(..._);
    console.warn = w;
    return output;
  };
};

export { wrapWarn };
