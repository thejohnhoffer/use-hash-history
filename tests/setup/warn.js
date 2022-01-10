const warn = async (fn) => {
  let warning = [];
  const _warn = console.warn;
  console.warn = new Proxy(_warn, {
    apply: (..._) => warning.push(..._[2]),
  });
  const result = await fn();
  console.warn = _warn;
  return {
    result,
    warning,
  };
};

export { warn };
