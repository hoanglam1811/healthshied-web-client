import { RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import AdminDashboard from "../adminRoutes/Dashboard";
import StaffManagement from "../adminRoutes/StaffManagement";
import CustomerManagement from "./CustomerManagement";
import VaccineManagement from "./VaccineManagement";
import VaccineDetailView from "./VaccineManagement/VaccineDetail";

const publicRoutes: RouteObject[] = [
    {
        path: RouteNames.ADMIN_DASHBOARD,
        element: <AdminDashboard />,
    },
    {
        path: RouteNames.STAFF_MANAGEMENT,
        element: <StaffManagement />,
    },
    {
        path: RouteNames.VACCINE_MANAGEMENT,
        element: <VaccineManagement />,
    },
    {
        path: RouteNames.VACCINE_DETAIL,
        element: <VaccineDetailView />,
    },
    {
        path: RouteNames.CUSTOMERS,
        element: <CustomerManagement />,
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

const adminRoutes: RouteObject[] = [
    {
        // path: "/",
        // element: <Navigate to={RouteNames.HOME} replace />,
    },
    ...publicRoutes,
];

export default adminRoutes;
