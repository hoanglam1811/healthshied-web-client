import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import Home from "./Home";
import AccountProfile from "./AccountProfile";
import ChangePassword from "./AccountChangePassword";
import AccountAppointments from "./AccountAppointments";
import ProfileLayout from "@/layout/CustomerProfileLayout";
import CustomerLayout from "@/layout/CustomerLayout";

const publicRoutes: RouteObject[] = [
  {
    path: RouteNames.HOME,
    element: <Home />,
  },
  
];

const privateRoutes: RouteObject[] = [
];

const clientRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to={RouteNames.HOME} replace />,
  },
  {
    element: <CustomerLayout/>,
    children: [
      ...publicRoutes
    ]
  },
  {
    element: <ProfileLayout/>,
    children: [
      {
        path: RouteNames.ACCOUNT,
        element: <AccountProfile />,
      },
      {
        path: RouteNames.ACCOUNT_CHANGE_PASSWORD,
        element: <ChangePassword />,
      },
      {
        path: RouteNames.ACCOUNT_APPOINTMENTS,
        element: <AccountAppointments />,
      }
    ]
  }
];

export default clientRoutes;
