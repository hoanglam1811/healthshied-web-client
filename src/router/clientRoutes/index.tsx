import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import Home from "./Home";
import AccountProfile from "./AccountProfile";
import ChangePassword from "./AccountChangePassword";
import AccountAppointments from "./AccountAppointments";
import ProfileLayout from "@/layout/CustomerProfileLayout";
import CustomerLayout from "@/layout/CustomerLayout";
import VaccineList from "./VaccineList";
import VaccineDetail from "./VaccineDetail";
import ProfessionalTeam from "./ProfessionalTeam";
import ProfessionalTeamDetails from "./ProfessionalTeamDetails";

const publicRoutes: RouteObject[] = [
  {
    path: RouteNames.HOME,
    element: <Home />,
  },
  {
    path: RouteNames.VACCINE_LIST,
    element: <VaccineList />,
  },
  {
    path: RouteNames.VACCINE_DETAIL,
    element: <VaccineDetail />,
  },
  {
    path: RouteNames.PROFESSIONAL_TEAM,
    element: <ProfessionalTeam />,
  },
  {
    path: RouteNames.PROFESSIONAL_TEAM_DETAILS,
    element: <ProfessionalTeamDetails />,
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
    element: <CustomerLayout />,
    children: [
      ...publicRoutes
    ]
  },
  {
    element: <ProfileLayout />,
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
