import { createBrowserRouter } from 'react-router-dom';

import Layout from '../components/layout/Layout';
import UserProfile from '../pages/user-profile/UserProfile';
import SignIn from '../pages/sign-in-page/SignIn';

const createRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: "profile/:username",
          element: <UserProfile />,
        }, 
        {
          path: "signin",
          element: <SignIn/>,
        },
      ],
    },
  ]);

export default createRouter;
