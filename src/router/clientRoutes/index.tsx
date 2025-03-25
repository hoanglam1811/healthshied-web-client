import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import Home from "./Home";
import AccountProfile from "./AccountProfile";

const publicRoutes: RouteObject[] = [
  {
    path: RouteNames.HOME,
    element: <Home />,
  },
  {
    path: RouteNames.ACCOUNT,
    element: <AccountProfile/>,
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
