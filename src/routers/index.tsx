import ROUTE_NAMES from "@/share/constants/router";
import MainLayout from "@/layouts/MainLayout";
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import { TodoPage } from "@/domains/todo";
import AuthLayout from "@/layouts/AuthLayout";
import RegisterPage from "@/domains/auth/pages/RegisterPage";
import LoginPage from "@/domains/auth/pages/LoginPage";

export default function Routers() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path={ROUTE_NAMES.index}>
                <Route element={<MainLayout />}>
                    <Route index element={<TodoPage />} />
                </Route>
                <Route path={ROUTE_NAMES.auth.index} element={<AuthLayout />}>
                    <Route
                        path={ROUTE_NAMES.auth.register}
                        element={<RegisterPage />}
                    />
                    <Route
                        path={ROUTE_NAMES.auth.login}
                        element={<LoginPage />}
                    />
                </Route>
            </Route>,
        ),
    );

    return <RouterProvider router={router} />;
}
