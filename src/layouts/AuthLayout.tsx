import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                background: "red",
                display: "grid",
                placeItems: "center",
            }}
        >
            <Outlet />
        </Box>
    );
}
