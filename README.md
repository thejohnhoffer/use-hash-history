# [Use Hash History](https://yarnpkg.com/package/history-noslash#readme)

This package exists as a stopgap until [Issue #912](https://github.com/remix-run/history/issues/912) is resolved.

Here is a [live demo on CodeSandbox](https://codesandbox.io/s/hash-router-history-noslash-sxud8),
and here is a [minimal template](https://github.com/thejohnhoffer/test-history-router#history-router-test-template) of the below example.

## Installation and Example

To install along with `react-router-dom@6.1.1`:

```
yarn add use-hash-history react-router-dom@6.1.1
```

Because `react-router-dom@6.1.1` includes `history@5`, our only peer dependency is met. See [here](https://github.com/remix-run/react-router/pull/7586#issuecomment-991703987) for why `history` is only a peer dependency rather than a dependency. Use with `react-router-dom@6.1.1` as follows:

```jsx
import { useHashHistory } from "use-hash-history";
import { Routes, Route, Link } from "react-router-dom";
import * as React from "react";

const App = ({ hashType }) => {
  const hashRoot = {
    slash: "/",
    noslash: "",
    hashbang: "!/",
  }[hashType];
  const history = useHistory({ hashRoot });
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

## Contributing

The published copy lives on a [publish branch](https://github.com/thejohnhoffer/use-hash-history/tree/publish).
Make any pull request against the main branch.
