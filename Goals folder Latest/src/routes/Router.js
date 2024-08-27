import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Reporting from '../pages/Supplier/Reporting';
import Dashboard from '../pages/Supplier/DashBoard'
import Goals from '../pages/Supplier/Goals/Goals';

const router = createBrowserRouter([
  {
    path: '/goals',
    element: <Goals/>,
  },
  {
    path: '/dashboard',
    element: <Dashboard/>,
  },
  {
    path: '/reporting',
    element: <Reporting/>,
  }
]);

export default router;
