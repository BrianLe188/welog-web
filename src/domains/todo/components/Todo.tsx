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
import { memo, useEffect, useState } from "react";
import { v4 } from "uuid";

interface ITodoStyledProps {
    isDragging?: boolean;
    isActive?: boolean;
}

interface ITodoProps extends ITodoStyledProps {
    data: ITodo;
    onSubmit: (value: ITodo) => void;
    onRemove: (id?: string) => void;
    onClick: () => void;
}

const defaultDetail = {
    _id: v4(),
    title: "",
};

export default memo(function Todo({
    data,
    isDragging = false,
    isActive = false,
    onSubmit,
    onRemove,
    onClick,
}: ITodoProps) {
    /**
     * States
     */
    const [isShowInputTitle, setIsShowInputTitle] = useState(!data?.title);
    const [detail, setDetail] = useState<ITodo>(defaultDetail);

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

    /**
     * Render
     */

    return (
        <TodoBox onClick={onClick} isDragging={isDragging} isActive={isActive}>
            <Stack direction={"row"} spacing={2}>
                <Checkbox />
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
                            <Typography>{detail?.title}</Typography>
                        </ButtonBase>
                    )}
                </Box>
            </Stack>
        </TodoBox>
    );
});

const TodoBox = styled(Box)<ITodoStyledProps>(({
    theme,
    isDragging,
    isActive,
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
