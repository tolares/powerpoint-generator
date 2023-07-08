import { createBrowserRouter } from "react-router-dom";
import App from "./client/home/App";
import Docs from "./client/docs/Docs";

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
