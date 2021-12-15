import React from "react";
import { useHashHistory, useHashParser } from "../src/index.ts";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { Routes, Route, Outlet, Link, useLocation } from "react-router-dom";

// Types
import type { Props } from "./exampleProps";

const Status = ({ prefix, path }) => {
  //const here = useHashParser(options)(useLocation());
  const here = true;
  return (
    <>
      {prefix}
      {path}
      <Outlet />
    </>
  );
};

const NestRoutes = (options, [path, ...list], key = -1) => {
  const prefix = key >= 0 ? options.hashRoot : options.hashSlash;
  const element = <Status {...{ prefix, path }} />;
  return path === undefined ? (
    ""
  ) : (
    <Route {...{ key, path, element }}>{NestRoutes(options, list)}</Route>
  );
};

const Example = ({ options: opts, routes }: Props) => {
  const { hashRoot = "", hashSlash = "/" } = opts;
  const lists = routes.map((_) => _.split("/"));
  const paths = lists.map((_) => _.join(hashSlash));
  const options = { hashRoot, hashSlash };
  const history = useHashHistory(options);

  return (
    <HistoryRouter history={history}>
      <h3>
        {`#${hashRoot}root${hashSlash}slash #`}
        <Routes>
          {lists.map((list, key) => {
            return NestRoutes(options, list, key);
          })}
          <Route path="*" element={<>{hashRoot}</>} />;
        </Routes>
      </h3>
      <ul>
        {paths.map((path, i) => {
          return (
            <li key={i}>
              <Link to={`/${path}`}>Go to #{hashRoot + path}</Link>
            </li>
          );
        })}
      </ul>
    </HistoryRouter>
  );
};

Example.defaultProps = {
  routes: ["home"],
  options: {},
};

export default Example;
