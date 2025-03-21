import { RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import Login from "./Login";
import Register from "./Register";
import Home from "../clientRoutes/Home";
import AdminDashboard from "../adminRoutes/Dashboard";
import StaffDashboard from "../staffRoutes/Dashboard";
//import ForgotPassword from "./ForgotPassword";

const publicRoutes: RouteObject[] = [
    // {
    //     path: RouteNames.HOME,
    //     element: <Home />,
    // },
    {
        path: RouteNames.LOGIN,
        element: <Login />,
    },
    {
        path: RouteNames.REGISTER,
        element: <Register />,
    },
    {
        path: RouteNames.ADMIN_DASHBOARD,
        element: <AdminDashboard />,
    },
    {
        path: RouteNames.STAFF_DASHBOARD,
        element: <StaffDashboard />,
    },
    //   {
    //     path: RouteNames.FORGOT_PASSWORD,
    //     element: <ForgotPassword />,
    //   },
];

const privateRoutes: RouteObject[] = [
    // {
    //   path: RouteNames.ACCOUNT_INFO,
    //   element: <AccountInfo />,
    // },
];

const commonRoutes: RouteObject[] = [
    {
        // path: "/",
        // element: <Navigate to={RouteNames.HOME} replace />,
    },
    ...publicRoutes,
];

export default commonRoutes;
