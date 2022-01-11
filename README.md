# [Use Hash History](https://yarnpkg.com/package/use-hash-history)

[![codecov][codecov]][codecov_url] [![npm version][npm_version]][npm_version_url]

[npm_version]: https://badge.fury.io/js/use-hash-history.svg
[codecov]: https://codecov.io/gh/thejohnhoffer/use-hash-history/branch/main/graph/badge.svg?token=ULXHI9HTYZ
[npm_version_url]: https://www.npmjs.com/package/use-hash-history
[codecov_url]: https://codecov.io/gh/thejohnhoffer/use-hash-history

This package is a workaround to [history](https://github.com/remix-run/history) [Issue #912](https://github.com/remix-run/history/issues/912).

Here is a [live demo on CodeSandbox](https://codesandbox.io/s/use-hash-history-esl4q),
and here is a [minimal template](https://github.com/thejohnhoffer/test-history-router#history-router-test-template) of the below example.

## Installation and Example

To install along with `react-router-dom@6.2.1`, run:

```
pnpm add use-hash-history react-router-dom@6.2.1
```

Or, run `npm install` or `yarn add`, based on your package manager. To [avoid duplicate dependencies](https://github.com/remix-run/react-router/pull/7586#issuecomment-991703987), also install the peer dependency `history` to match the version used by `react-router-dom`.

Use with a version of `react-router-dom` from `6.1.1` to `6.2.1` as follows:

```jsx
import * as React from "react";
import { useHashHistory } from "use-hash-history";
import { Routes, Route, Link } from "react-router-dom";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";

const Example = ({ hashRoot = "" }) => {
  const history = useHashHistory({ hashRoot });
  return (
    <HistoryRouter history={history}>
      <Link to="/home">Go to #{hashRoot}home</Link>
      <Routes>
        <Route path="home" element={<> here!</>} />;
        <Route path="*" element={<>...</>} />;
      </Routes>
    </HistoryRouter>
  );
};
```

Using the above `Example`, you can actually resurrect the [lost `hashType` feature](https://v5.reactrouter.com/web/api/HashRouter/hashtype-string) of `react-router-dom@5` (and `history@4`) with the following `HashTypeExample` component that handles the old `hashType`:

```jsx
const HashTypeExample = ({ hashType }) => {
  const hashRoot = {
    slash: "/",
    noslash: "",
    hashbang: "!/",
  }[hashType];

  return <Example hashRoot={hashRoot}>
}
```

## Contributing

The published copy lives at [use-hash-history](https://github.com/thejohnhoffer/use-hash-history/).
Make any pull request against the main branch.

### Package manager

I build and test with [pnpm](https://pnpm.io/). I've tried `npm`, `yarn@1`, `yarn@berry`, but The [`uvu` testing library](https://www.npmjs.com/package/uvu) currently [recommendeds](https://github.com/lukeed/uvu/issues/144#issuecomment-939316208) `pnpm`.
