import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import StaffDashboard from "../staffRoutes/Dashboard";
import StaffScheduleByStaff from "./StaffShift";
import StaffProfile from "./StaffProfile";

const publicRoutes: RouteObject[] = [
    // {
    //     path: RouteNames.HOME,
    //     element: <Home />,
    // },
    {
        path: RouteNames.STAFF_DASHBOARD,
        element: <StaffDashboard />,
    },
    {
        path: RouteNames.STAFF_SHIFT_PAGE,
        element: <StaffScheduleByStaff />,
    },
    {
        path: RouteNames.STAFF_PROFILE,
        element: <StaffProfile />,
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
        path: "/staff",
        element: <Navigate to={RouteNames.STAFF_DASHBOARD} replace />,
    },
    ...publicRoutes,
];

export default staffRoutes;
