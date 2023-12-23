import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./layout/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/auth/Login";
import AuthProvider from "./provider/AuthProvider";

import PageNotFound from "./components/PageNotFound";

import RoleRestriction from "./pages/admin/RoleRestriction";
import AllSuperAdmin from "./pages/superAdmin/AllSuperAdmin";
import SuperAdminViewDetails from "./pages/superAdmin/SuperAdminViewDetails";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Login />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "*",
            element: <PageNotFound />,
        },

        {
            element: <AuthProvider />,
            children: [
                {
                    element: <RoleRestriction />,
                    children: [
                        {
                            element: <AdminLayout />,
                            children: [
                                {
                                    path: "/dashboard",
                                    element: <Dashboard />,
                                },
                                {
                                    path: "/super-admin-list",
                                    element: <AllSuperAdmin />,
                                },
                                {
                                    path: "/super-admin-view-details/:id",
                                    element: <SuperAdminViewDetails />,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ]
    // { basename: "/v2" }
);

export default router;
