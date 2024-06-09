import { ITimeline } from "@/share/types/timeline";
import { Box, Stack, styled } from "@mui/material";
import Text from "@/share/components/Text";
import { List, DoneAll, ErrorOutline } from "@mui/icons-material";

interface ITaskDateProps {
    data: ITimeline;
    isDraggingOver?: boolean;
    isDragging?: boolean;
    onClick: (data: ITimeline) => void;
}

interface ITaskDateBoxProps {
    checked: boolean;
    isDragging?: boolean;
    isDraggingOver?: boolean;
}

export default function TaskDate({
    data,
    isDragging,
    isDraggingOver,
    onClick,
}: ITaskDateProps) {
    return (
        <TaskDateBox
            checked={data.checked}
            isDragging={isDragging}
            isDraggingOver={isDraggingOver}
            onClick={() => onClick(data)}
        >
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
                                data.todos?.filter((i) => i.done)?.length || 0,
                            )}
                        />
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"}>
                        <ErrorOutline color="error" />
                        <Text
                            title={String(
                                data.todos?.filter((i) => !i.done)?.length || 0,
                            )}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </TaskDateBox>
    );
}

const TaskDateBox = styled(Box)<ITaskDateBoxProps>(({
    theme,
    checked,
    isDragging,
    isDraggingOver,
}) => {
    const styles: any = {
        padding: 15,
        border: 1,
        borderColor: checked ? theme.border.active : theme.border.primary,
        borderStyle: "solid",
        borderRadius: 15,
        cursor: "pointer",
    };

    if (isDragging) {
        styles["opacity"] = isDraggingOver ? 1 : 0.3;
        styles["borderColor"] = isDraggingOver
            ? theme.border.active
            : theme.border.primary;
    }

    return styles;
});
