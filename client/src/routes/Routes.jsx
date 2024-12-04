import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "../components/layout/Layout";
import UserProfile from "../pages/user-profile/UserProfile";
import SignIn from "../pages/sign-in-page/SignIn";
import SignUp from "../pages/sign-up-page/SignUp";

import PrivateRoute from "../components/private-route/PrivateRoute";

import { AuthProvider } from '../contexts/AuthContext';

const RouterLayout = () => {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <RouterLayout />,
    children: [
      {
        path: "profile/:username",
        element: (
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },
]);

const AppRouter = () => {
  return (
      <RouterProvider router={router} />
);
};

export default AppRouter;
