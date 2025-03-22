import { createBrowserRouter } from "react-router-dom";
import NoLayout from "../layout/NoLayout/index";
import NotFound from "./commonRoutes/404";
import commonRoutes from "./commonRoutes";
import AdminLayout from "@/layout/AdminLayout";
import adminRoutes from "./adminRoutes";
import StaffLayout from "@/layout/StaffLayout";
import staffRoutes from "./staffRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <ClientLayout />,
    // children: [...clientRoutes],
    errorElement: <NotFound />,
  },
  {
    element: <NoLayout />,
    children: [...commonRoutes],
    errorElement: <NotFound />,
  },
  {
    element: <AdminLayout />,
    children: [...adminRoutes],
    errorElement: <NotFound />,
  },
  {
    element: <StaffLayout />,
    children: [...staffRoutes],
    errorElement: <NotFound />,
  },
]);

export default router;
