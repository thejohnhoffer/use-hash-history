import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { useHashHistory, useParsePath } from "../src/index";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";

// Types
import type { Props } from "./exampleProps";

const Example = ({
  options
} : Props) => {
  const {
    hashRoot = "", hashSlash = "/"
  } = {window, ...options}
  const opts = {hashRoot, hashSlash}
  const history = useHashHistory(opts)
  return (
    <HistoryRouter history={history}>
      <Link to="/home">Go to #{hashRoot}home</Link>
      <Routes>
        <Route path="home" element={<> here!</>} />;
        <Route path="*" element={<>...</>} />;
      </Routes>
    </HistoryRouter>
  );
}

export default Example
