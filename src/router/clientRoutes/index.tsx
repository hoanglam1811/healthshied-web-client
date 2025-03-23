import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import Home from "./Home";

const publicRoutes: RouteObject[] = [
  // {
  //   path: RouteNames.PAYMENT_SUCCESS,
  //   element: <PaymentSuccess />,
  // },
  // {
  //   path: RouteNames.PAYMENT_FAILED,
  //   element: <PaymentFailed />,
  // }, {
  //   path: RouteNames.PAYMENT_ERROR,
  //   element: <PaymentError />,
  // }, {
  //   path: RouteNames.PAYMENT_NOT_FOUND,
  //   element: <PaymentNotFound />,
  // }, {
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
  ...publicRoutes,
];

export default clientRoutes;
