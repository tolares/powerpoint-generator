import { createBrowserRouter } from "react-router-dom";
import App from "./home/App";
import Docs from "./docs/Docs";
import React from "react";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/docs",
    element: <Docs />,
  },
]);
