import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import AdminDashboard from "../adminRoutes/Dashboard";
import StaffManagement from "../adminRoutes/StaffManagement";
import CustomerManagement from "./CustomerManagement";
import VaccineManagement from "./VaccineManagement";
import VaccineDetailView from "./VaccineManagement/VaccineDetail";
import StaffDetailView from "./StaffManagement/StaffDetail";
import BlogManagement from "./BlogManagement";
import AdminOrderManagement from "./OrderManagement";
import FeedbackManagement from "./FeedbackManagement";

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
        path: RouteNames.STAFF_DETAIL,
        element: <StaffDetailView />,
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
    },
    {
        path: RouteNames.BLOG_MANAGEMENT,
        element: <BlogManagement />,
    },
    {
        path: RouteNames.ORDERS,
        element: <AdminOrderManagement />,
    },
    {
        path: RouteNames.VACCINE_PACKAGE,
        element: <AdminOrderManagement />,
    },
    {
        path: RouteNames.FEEDBACK_MANAGEMENT,
        element: <FeedbackManagement />,
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
        path: "/admin",
        element: <Navigate to={RouteNames.ADMIN_DASHBOARD} replace />,
    },
    ...publicRoutes,
];

export default adminRoutes;
