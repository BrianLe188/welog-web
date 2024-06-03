import { ITimeline } from "@/share/types/timeline";
import { Box, Stack, styled } from "@mui/material";
import Text from "@/share/components/Text";
import { List, DoneAll, ErrorOutline } from "@mui/icons-material";

interface ITaskDateProps {
    data: ITimeline;
}

interface ITaskDateBoxProps {
    checked: boolean;
}

export default function TaskDate({ data }: ITaskDateProps) {
    return (
        <TaskDateBox checked={data.checked}>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Text title={data.date} />
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Stack direction={"row"} alignItems={"center"}>
                        <List />
                        <Text title={String(data.todos?.length || 0)} />
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                        <DoneAll color={"success"} />
                        <Text
                            title={String(
                                data.todos?.filter((i) => i)?.length || 0,
                            )}
                        />
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                        <ErrorOutline color="error" />
                        <Text
                            title={String(
                                data.todos?.filter((i) => i)?.length || 0,
                            )}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </TaskDateBox>
    );
}

const TaskDateBox = styled(Box)<ITaskDateBoxProps>(({ theme, checked }) => {
    const styles: any = {
        padding: 15,
        border: 1,
        borderColor: checked ? theme.border.active : theme.border.primary,
        borderStyle: "solid",
        borderRadius: 15,
    };

    return styles;
});
