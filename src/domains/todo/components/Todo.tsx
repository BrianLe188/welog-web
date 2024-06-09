import { ITodo } from "@/share/types/timeline";
import {
    Box,
    ButtonBase,
    Checkbox,
    Stack,
    TextField,
    Typography,
    styled,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import { updateTodoByKey } from "../services/TodoService";
import {
    onUpdateTodoInTimelineSubscription,
    useTimeline,
} from "@/zustand/useTimeline";
import { onSetMessageSubscription, useAlert } from "@/zustand/useAlert";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

type Data = ITodo & { tlId?: string };

interface ITodoStyledProps {
    isDragging?: boolean;
    isActive?: boolean;
    isDone?: boolean;
}

interface ITodoProps extends ITodoStyledProps {
    data: Data;
    onSubmit: (value: ITodo) => void;
    onRemove: (id?: string) => void;
    onClick: () => void;
}

const defaultDetail = {
    tlId: "",
    _id: v4(),
    title: "",
    done: false,
    order: 0,
};

export default function Todo({
    data,
    isDragging = false,
    isActive = false,
    onSubmit,
    onRemove,
    onClick,
}: ITodoProps) {
    /**
     * Subscriptions
     */
    const updateTodoInTimelineSubscription = useTimeline(
        onUpdateTodoInTimelineSubscription,
    );
    const alertSetMessageSubscription = useAlert(onSetMessageSubscription);

    /**
     * States
     */
    const [isShowInputTitle, setIsShowInputTitle] = useState(!data?.title);
    const [detail, setDetail] = useState<Data>(defaultDetail);

    /**
     * Effects
     */

    useEffect(() => {
        if (data) {
            setDetail(data);
        }
    }, [data]);

    /**
     * Function definition
     */

    const handleChange = (key: string, value: string) => {
        setDetail((state) => ({
            ...state,
            [key]: value,
        }));
    };

    const handleShowInputTitle = () => {
        setIsShowInputTitle(true);
    };

    const handleHideInputTitle = () => {
        setIsShowInputTitle(false);
    };

    const handleSubmitChange = () => {
        if (detail.title?.trim()) {
            onSubmit(detail);
            handleHideInputTitle();
        } else {
            onRemove(detail._id);
        }
    };

    const handleCheckDone = async (e: ChangeEvent<HTMLInputElement>) => {
        const updated = await updateTodoByKey({
            data: {
                params: { id: detail._id },
                body: {
                    key: "done",
                    value: e.target.checked,
                },
            },
            errorCallbackAction: (err: any) => {
                alertSetMessageSubscription(
                    err.response?.data?.message,
                    "error",
                );
            },
        });

        if (detail?.tlId && detail._id && updated)
            updateTodoInTimelineSubscription(detail._id, updated, detail?.tlId);
    };

    /**
     * Render
     */

    return (
        <TodoBox
            onClick={onClick}
            isDragging={isDragging}
            isActive={isActive}
            isDone={detail.done}
        >
            <Stack direction={"row"} spacing={2}>
                <Checkbox
                    {...label}
                    onChange={handleCheckDone}
                    checked={detail.done}
                />
                <Box sx={{ width: "100%" }}>
                    {isShowInputTitle ? (
                        <TextField
                            size="small"
                            fullWidth
                            value={detail?.title}
                            onChange={(e) =>
                                handleChange("title", e.target.value)
                            }
                            onBlur={handleSubmitChange}
                            autoFocus
                        />
                    ) : (
                        <ButtonBase
                            sx={{
                                height: "100%",
                                width: "100%",
                                justifyContent: "start",
                                paddingX: 2,
                            }}
                            onClick={handleShowInputTitle}
                        >
                            <Typography
                                sx={{
                                    textDecoration: detail.done
                                        ? "line-through"
                                        : "",
                                }}
                            >
                                {detail?.title}
                            </Typography>
                        </ButtonBase>
                    )}
                </Box>
            </Stack>
        </TodoBox>
    );
}

const TodoBox = styled(Box)<ITodoStyledProps>(({
    theme,
    isDragging,
    isActive,
    isDone,
}) => {
    const styles: any = {
        border: 1,
        borderRadius: 15,
        padding: 15,
        borderColor: theme.border.primary,
        borderStyle: "solid",
        backgroundColor: "#fff",
    };

    if (isActive || isDragging) {
        // styles.color = "#fff";
        styles.boxShadow = "0 0 5px red";
    }

    if (isDragging) {
        styles.transform = "rotate(3deg)";
    }

    return styles;
});
