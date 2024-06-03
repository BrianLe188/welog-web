import { Box, Typography } from "@mui/material";

interface ITodoLabelProps {
    name: string;
}

export default function TodoLabel({ name }: ITodoLabelProps) {
    return (
        <Box
            sx={{
                paddingX: 2,
                paddingY: 1,
                borderRadius: 15,
                backgroundColor: "red",
            }}
        >
            <Typography fontSize={14}>{name}</Typography>
        </Box>
    );
}
