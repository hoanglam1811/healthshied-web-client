import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import Home from "./Home";
import AccountProfile from "./AccountProfile";
import ChangePassword from "./AccountChangePassword";
import AccountAppointments from "./AccountAppointments";

const publicRoutes: RouteObject[] = [
  {
    path: RouteNames.HOME,
    element: <Home />,
  },
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
];

const privateRoutes: RouteObject[] = [
];

const clientRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to={RouteNames.HOME} replace />,
  },
  ...publicRoutes,
];

export default clientRoutes;
