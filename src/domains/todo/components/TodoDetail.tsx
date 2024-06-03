import { Box, styled } from "@mui/material";
import Text from "@/share/components/Text";

export default function TodoDetail() {
    return (
        <Box>
            <Text title="Task Detail" variant="h5" />
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
