import ROUTE_NAMES from "@/share/constants/router";
import MainLayout from "@/layouts/MainLayout";
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import { TodoPage } from "@/domains/todo";

export default function Routers() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path={ROUTE_NAMES.index}>
                <Route element={<MainLayout />}>
                    <Route index element={<TodoPage />} />
                </Route>
            </Route>,
        ),
    );

    return <RouterProvider router={router} />;
}
