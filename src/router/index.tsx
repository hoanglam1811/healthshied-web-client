import { createBrowserRouter } from "react-router-dom";
import NoLayout from "../layout/NoLayout/index";
import NotFound from "./commonRoutes/404";
import commonRoutes from "./commonRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    //element: <ClientLayout />,
    //children: [...clientRoutes],
    errorElement: <NotFound />,
  },
  {
    element: <NoLayout />,
    children: [...commonRoutes],
    errorElement: <NotFound />,
  },
]);

export default router;
