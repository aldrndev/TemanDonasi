import { createBrowserRouter, redirect } from "react-router-dom";
import HomePage from "../views/HomePage";
import Campaign from "../views/Campaign";
import Dashboard from "../views/Dashboard";
import Reward from "../views/Reward";
import UserDonation from "../views/UserDonation";
import RedeemHistory from "../views/RedeemHistory";
import LoginPage from "../views/LoginPage";
import RegisterPage from "../views/RegisterPage";
import UserPage from "../views/UserPage";
import AdminPage from "../views/AdminPage";
import Certificate from "../views/Certificate";
import VerifyPage from "../views/VerifyPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    loader: () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        return redirect("/login");
      }

      return null;
    },
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/campaign",
        element: <Campaign />,
      },
      {
        path: "/reward",
        element: <Reward />,
      },
      {
        path: "/user-donation",
        element: <UserDonation />,
      },
      {
        path: "/redeem-history",
        element: <RedeemHistory />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/user-list",
        element: <UserPage />,
      },
      {
        path: "/admin-list",
        element: <AdminPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/certificate/:code",
    element: <Certificate />,
  },
  {
    path: "/pub/verify/:verificationCode",
    element: <VerifyPage />,
  },
]);

export default router;
