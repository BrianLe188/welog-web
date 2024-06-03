import Sidebar from "@/share/components/Sidebar";
import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <Box
            sx={{
                height: "100vh",
            }}
        >
            <Stack
                sx={{
                    height: "100%",
                }}
                direction={"row"}
            >
                <Sidebar />
                <Box sx={{ width: "100%" }}>
                    <Outlet />
                </Box>
            </Stack>
        </Box>
    );
}
