import { createBrowserRouter } from "react-router-dom";
import App from "./app/home/App";
import Docs from "./app/docs/Docs";

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
