import { RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import StaffDashboard from "../staffRoutes/Dashboard";

const publicRoutes: RouteObject[] = [
    // {
    //     path: RouteNames.HOME,
    //     element: <Home />,
    // },
    {
        path: RouteNames.STAFF_DASHBOARD,
        element: <StaffDashboard />,
    }
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

const staffRoutes: RouteObject[] = [
    {
        // path: "/",
        // element: <Navigate to={RouteNames.HOME} replace />,
    },
    ...publicRoutes,
];

export default staffRoutes;
