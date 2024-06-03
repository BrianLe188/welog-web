import Button from "@/share/components/Button";
import Text from "@/share/components/Text";
import { ITodo } from "@/share/types/timeline";
import {
    onAddTodoInTimelineSubscription,
    onInitTodosInTimelineSubscription,
    onRemoveTodoInTimelineSubscription,
    onUpdateTodoInTimelineSubscription,
    targetTimelineSelector,
    useTimeline,
} from "@/zustand/useTimeline";
import { ControlPointOutlined } from "@mui/icons-material";
import { Box, Stack, styled } from "@mui/material";
import { useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Daily from "../components/Daily";
import TodoDetail from "../components/TodoDetail";
import Todos from "../components/Todos";

const reorder = (list: ITodo[], startIndex: number, endIndex: number) => {
    const [removed] = list.splice(startIndex, 1);
    if (list[endIndex]) {
        list.splice(endIndex, 1, removed, list[endIndex]);
    } else {
        list.splice(endIndex, 1, removed);
    }

    return list;
};

export default function TodoPage() {
    /**
     * Subscriptions, Selections
     */
    const targetTimeline = useTimeline(targetTimelineSelector);
    const updateTodoInTimelineSubscription = useTimeline(
        onUpdateTodoInTimelineSubscription,
    );
    const addTodoInTimelineSubscription = useTimeline(
        onAddTodoInTimelineSubscription,
    );
    const removeTodoInTimelineSubscription = useTimeline(
        onRemoveTodoInTimelineSubscription,
    );
    const initTodosInTimelineSubscription = useTimeline(
        onInitTodosInTimelineSubscription,
    );

    /**
     * States
     */
    const [selectedTodo, setSelectedTodo] = useState<ITodo>();
    const [isAdding, setIsAdding] = useState(false);

    /**
     * Function definition
     */

    const handleUpdateTodo = (id: string, value: ITodo) => {
        if (isAdding) {
            setIsAdding(false);
        }

        if (targetTimeline)
            updateTodoInTimelineSubscription(id, value, targetTimeline._id);
    };

    const handleAddTodo = () => {
        if (targetTimeline) addTodoInTimelineSubscription(targetTimeline._id);
        setIsAdding(true);
    };

    const handleRemove = (id?: string) => {
        if (isAdding) {
            setIsAdding(false);
        }

        if (targetTimeline)
            removeTodoInTimelineSubscription(targetTimeline._id, id);
    };

    const handleSelectTodo = (todo: ITodo) => {
        if (selectedTodo?._id !== todo._id) {
            setSelectedTodo(todo);
        }
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }
        const todos = reorder(
            targetTimeline?.todos || [],
            result.source.index,
            result.destination.index,
        );

        if (targetTimeline)
            initTodosInTimelineSubscription(targetTimeline._id, todos);
    };

    /**
     * Render
     */

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Stack direction={"row"}>
                <MainBox>
                    <MainHeadBox>
                        <Text title="Todo" variant="h4" />
                    </MainHeadBox>
                    <MainTodoListBox>
                        <Stack
                            direction={"row"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                        >
                            <Text
                                title={targetTimeline?.date || ""}
                                variant="h5"
                            />
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
                            droppableId="todos"
                            key={targetTimeline?.todos?.length}
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
                                        todos={targetTimeline?.todos || []}
                                        onUpdateTodo={handleUpdateTodo}
                                        onRemoveTodo={handleRemove}
                                        onSelectTodo={handleSelectTodo}
                                        selectedTodo={selectedTodo}
                                    />
                                </Box>
                            )}
                        </Droppable>
                    </MainTodoListBox>
                </MainBox>
                <Box sx={{ minWidth: 500, padding: 3 }}>
                    {selectedTodo?._id && selectedTodo?.title ? (
                        <TodoDetail />
                    ) : (
                        <Daily />
                    )}
                </Box>
            </Stack>
        </DragDropContext>
    );
}

const MainBox = styled(Box)(({ theme }) => ({
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
