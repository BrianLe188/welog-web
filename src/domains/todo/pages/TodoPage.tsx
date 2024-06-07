import Button from "@/share/components/Button";
import Text from "@/share/components/Text";
import { ITodo } from "@/share/types/timeline";
import {
    onAddTodoInTimelineSubscription,
    onInitTodosInTimelineSubscription,
    onRemoveTodoInTimelineSubscription,
    onUpdateTodoInTimelineSubscription,
    timelinesSelector,
    useTimeline,
} from "@/zustand/useTimeline";
import { ControlPointOutlined } from "@mui/icons-material";
import { Box, Stack, styled } from "@mui/material";
import { useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Daily from "../components/Daily";
import TodoDetail from "../components/TodoDetail";
import Todos from "../components/Todos";
import {
    createTodo,
    reOrderTodo,
    removeTodo,
    updateTodo,
} from "../services/TodoService";
import { onSetMessageSubscription, useAlert } from "@/zustand/useAlert";

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
    const timelines = useTimeline(timelinesSelector);
    const targetTimeline = timelines.find((tl) => tl.checked);
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
    const alertSetMessageSubscription = useAlert(onSetMessageSubscription);

    /**
     * States
     */
    const [selectedTodo, setSelectedTodo] = useState<ITodo>();
    const [isAdding, setIsAdding] = useState(false);
    const [isShowTodoDetail, setIsShowTodoDetail] = useState(false);

    /**
     * Function definition
     */

    const handleShowTodoDetail = () => setIsShowTodoDetail(true);

    const handleHideTodoDetail = () => setIsShowTodoDetail(false);

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

    const handleSelectTodo = (todo: ITodo) => {
        if (selectedTodo?._id !== todo._id) {
            setSelectedTodo(todo);
            handleShowTodoDetail();
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

        const currentTodoIndex = todos.findIndex(
            (td) => td._id === result.draggableId,
        );

        const above = todos[currentTodoIndex - 1]?.order || 0;
        const below = todos[currentTodoIndex + 1]?.order || 0;

        reOrderTodo({
            data: {
                params: { id: result.draggableId },
                body: {
                    above,
                    below,
                },
            },
            errorCallbackAction: (err: any) => {
                alertSetMessageSubscription(
                    err.response?.data?.message,
                    "error",
                );
            },
        });
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
                                        onSelectTodo={handleSelectTodo}
                                        selectedTodo={selectedTodo}
                                    />
                                </Box>
                            )}
                        </Droppable>
                    </MainTodoListBox>
                </MainBox>
                <Box sx={{ minWidth: 500, padding: 3 }}>
                    {isShowTodoDetail &&
                    selectedTodo?._id &&
                    selectedTodo?.title ? (
                        <TodoDetail onBack={handleHideTodoDetail} />
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
