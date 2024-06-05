import { Box, IconButton, Stack, styled } from "@mui/material";
import Text from "@/share/components/Text";
import { ArrowBackIos } from "@mui/icons-material";

interface ITodoDetailProps {
    onBack: () => void;
}

export default function TodoDetail({ onBack }: ITodoDetailProps) {
    return (
        <Box>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <IconButton onClick={onBack}>
                    <ArrowBackIos />
                </IconButton>
                <Text title="Task Detail" variant="h5" />
            </Stack>
            <DetailBox>
                <Text title="My Task" type="secondary" fontSize={15} />
            </DetailBox>
        </Box>
    );
}

const DetailBox = styled(Box)(({ theme }) => ({
    borderRadius: 15,
    border: 1,
    padding: 15,
    marginTop: 20,
    borderColor: theme.border.primary,
    borderStyle: "solid",
}));
