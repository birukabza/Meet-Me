import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';





const createRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Layout/>,  
    },

  ]);

export default createRouter;
