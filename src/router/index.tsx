import { createBrowserRouter } from "react-router-dom";
import NoLayout from "../layout/NoLayout/index";
import NotFound from "./commonRoutes/404";
import commonRoutes from "./commonRoutes";
import AdminLayout from "@/layout/AdminLayout";
import adminRoutes from "./adminRoutes";
import StaffLayout from "@/layout/StaffLayout";
import staffRoutes from "./staffRoutes";
import CustomerLayout from "@/layout/CustomerLayout";
import clientRoutes from "./clientRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [...clientRoutes],
    errorElement: <NotFound />,
  },
  {
    element: <NoLayout />,
    children: [...commonRoutes],
    errorElement: <NotFound />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [...adminRoutes],
    errorElement: <NotFound />,
  },
  {
    path: "/staff",
    element: <StaffLayout />,
    children: [...staffRoutes],
    errorElement: <NotFound />,
  },
]);

export default router;
