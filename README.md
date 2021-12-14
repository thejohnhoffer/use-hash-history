# [Use Hash History](https://www.npmjs.com/package/use-hash-history)

This package is a workaround to [history](https://github.com/remix-run/history) [Issue #912](https://github.com/remix-run/history/issues/912).

Here is a [live demo on CodeSandbox](https://codesandbox.io/s/use-hash-history-esl4q),
and here is a [minimal template](https://github.com/thejohnhoffer/test-history-router#history-router-test-template) of the below example.

## Installation and Example

To install along with `react-router-dom@6.1.1`:

```
yarn add use-hash-history react-router-dom@6.1.1
```

Because `react-router-dom@6.1.1` includes `history@5`, our only peer dependency is met. See [here](https://github.com/remix-run/react-router/pull/7586#issuecomment-991703987) for why `history` is only a peer dependency rather than a dependency. Use with `react-router-dom@6.1.1` as follows:

```jsx
import * as React from "react";
import { useHashHistory } from "use-hash-history";
import { Routes, Route, Link } from "react-router-dom";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";

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

The published copy lives at [use-hash-history](https://github.com/thejohnhoffer/use-hash-history/).
Make any pull request against the main branch.
