import { createBrowserRouter } from 'react-router-dom';

import Layout from '../components/layout/Layout';
import UserProfile from '../pages/user-profile/UserProfile';

const createRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: "profile",
          element: <UserProfile />,
        },  
      ],
    },
  ]);

export default createRouter;
