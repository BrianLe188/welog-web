import Button from "@/share/components/Button";
import Text from "@/share/components/Text";
import { ITodo } from "@/share/types/timeline";
import { onSetMessageSubscription, useAlert } from "@/zustand/useAlert";
import {
    onAddTodoInTimelineSubscription,
    onRemoveTodoInTimelineSubscription,
    onUpdateTodoInTimelineSubscription,
    timelinesSelector,
    useTimeline,
} from "@/zustand/useTimeline";
import { ControlPointOutlined } from "@mui/icons-material";
import { Box, Stack, styled } from "@mui/material";
import { memo, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import Todos from "../components/Todos";
import { TODO_DROPPABLE_ID } from "../constant";
import { createTodo, removeTodo, updateTodo } from "../services/TodoService";

interface IMainBoxProps {
    selectedTodoId: string | undefined;
    onSelectTodo: (todo: ITodo) => void;
}

export default memo(function MainBox({
    selectedTodoId,
    onSelectTodo,
}: IMainBoxProps) {
    /**
     * Subscriptions, Selections
     */
    const timelines = useTimeline(timelinesSelector);
    const targetTimeline = timelines.find((tl) => tl.checked);
    const addTodoInTimelineSubscription = useTimeline(
        onAddTodoInTimelineSubscription,
    );
    const removeTodoInTimelineSubscription = useTimeline(
        onRemoveTodoInTimelineSubscription,
    );
    const updateTodoInTimelineSubscription = useTimeline(
        onUpdateTodoInTimelineSubscription,
    );
    const alertSetMessageSubscription = useAlert(onSetMessageSubscription);

    /**
     * States
     */
    const [isAdding, setIsAdding] = useState(false);

    /**
     * Function definition
     */

    const handleAddTodo = async () => {
        if (targetTimeline) {
            const largestOrder =
                targetTimeline.todos[targetTimeline.todos.length - 1]?.order ||
                0;

            const todo = await createTodo({
                data: {
                    body: {
                        title: "",
                        timeline_id: targetTimeline._id,
                        above: largestOrder,
                        below: 0,
                    },
                },
                errorCallbackAction: (err: any) => {
                    alertSetMessageSubscription(
                        err.response?.data?.message,
                        "error",
                    );
                },
            });

            if (todo) addTodoInTimelineSubscription(targetTimeline._id, todo);
        }

        setIsAdding(true);
    };

    const handleRemove = async (id?: string) => {
        if (isAdding) {
            setIsAdding(false);
        }

        if (targetTimeline) {
            if (id)
                await removeTodo({
                    data: { params: { id } },
                    errorCallbackAction: () => {},
                });

            removeTodoInTimelineSubscription(targetTimeline._id, id);
        }
    };

    const handleUpdateTodo = async (id: string, value: ITodo) => {
        if (isAdding) {
            setIsAdding(false);
        }

        if (targetTimeline) {
            const updated = await updateTodo({
                data: {
                    params: { id },
                    body: value,
                },
                errorCallbackAction: (err: any) => {
                    alertSetMessageSubscription(
                        err.response?.data?.message,
                        "error",
                    );
                },
            });

            updateTodoInTimelineSubscription(id, updated, targetTimeline._id);
        }
    };

    return (
        <MainBoxStyled>
            <MainHeadBox>
                <Text title="Todo" variant="h4" />
            </MainHeadBox>
            <MainTodoListBox>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Text title={targetTimeline?.date || ""} variant="h5" />
                    <Button
                        name="New Task"
                        icon={
                            <ControlPointOutlined
                                sx={{
                                    color: "white",
                                }}
                            />
                        }
                        onClick={handleAddTodo}
                        disabled={isAdding}
                    />
                </Stack>
                <Droppable
                    droppableId={TODO_DROPPABLE_ID}
                    key={targetTimeline?._id}
                >
                    {(provided, _snapshot) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{
                                marginTop: 3,
                            }}
                        >
                            <Todos
                                tlId={targetTimeline?._id}
                                todos={targetTimeline?.todos || []}
                                onUpdateTodo={handleUpdateTodo}
                                onRemoveTodo={handleRemove}
                                onSelectTodo={onSelectTodo}
                                selectedTodoId={selectedTodoId}
                            />
                        </Box>
                    )}
                </Droppable>
            </MainTodoListBox>
        </MainBoxStyled>
    );
});

const MainBoxStyled = styled(Box)(({ theme }) => ({
    flex: 1,
    border: 0,
    borderRight: 1,
    height: "100vh",
    overflow: "auto",
    position: "relative",
    borderColor: theme.border.primary,
    borderStyle: "solid",
}));

const MainHeadBox = styled(Box)(({ theme }) => ({
    border: 0,
    borderBottom: 1,
    padding: 15,
    position: "sticky",
    top: 0,
    backgroundColor: "#fff",
    zIndex: 100,
    borderColor: theme.border.primary,
    borderStyle: "solid",
}));

const MainTodoListBox = styled(Box)(({ theme }) => ({
    padding: 15,
}));
