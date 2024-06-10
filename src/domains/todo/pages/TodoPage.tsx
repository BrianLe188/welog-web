import { ITodo } from "@/share/types/timeline";
import { onSetMessageSubscription, useAlert } from "@/zustand/useAlert";
import {
    onInitTodosInTimelineSubscription,
    onMoveTodoToAnotherTimelineSubscription,
    onToggleDraggingSubscription,
    timelinesSelector,
    useTimeline,
} from "@/zustand/useTimeline";
import { Box, Stack } from "@mui/material";
import { useCallback, useState } from "react";
import {
    DragDropContext,
    DragStart,
    DropResult,
    ResponderProvided,
} from "react-beautiful-dnd";
import Daily from "../components/Daily";
import MainBox from "../components/MainBox";
import TodoDetail from "../components/TodoDetail";
import { TODO_DROPPABLE_ID } from "../constant";
import { reOrderTodo, updateTodoByKey } from "../services/TodoService";

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
    const toggleDraggingSubscription = useTimeline(
        onToggleDraggingSubscription,
    );
    const moveTodoToAnotherTimelineSubscription = useTimeline(
        onMoveTodoToAnotherTimelineSubscription,
    );
    const initTodosInTimelineSubscription = useTimeline(
        onInitTodosInTimelineSubscription,
    );
    const alertSetMessageSubscription = useAlert(onSetMessageSubscription);

    /**
     * States
     */
    const [selectedTodo, setSelectedTodo] = useState<ITodo>();
    const [isShowTodoDetail, setIsShowTodoDetail] = useState(false);

    /**
     * Function definition
     */

    const handleShowTodoDetail = () => setIsShowTodoDetail(true);

    const handleHideTodoDetail = () => setIsShowTodoDetail(false);

    const handleSelectTodo = useCallback(
        (todo: ITodo) => {
            if (selectedTodo?._id !== todo._id) {
                setSelectedTodo(todo);
                handleShowTodoDetail();
            }
        },
        [selectedTodo],
    );

    const handleDragStart = (
        _start: DragStart,
        _provided: ResponderProvided,
    ) => {
        toggleDraggingSubscription();
    };

    const handleDragEnd = async (result: DropResult) => {
        toggleDraggingSubscription();

        if (!result.destination) {
            return;
        }

        if (
            result.destination.droppableId !== TODO_DROPPABLE_ID &&
            result.destination.droppableId !== targetTimeline?._id
        ) {
            const todo = await updateTodoByKey({
                data: {
                    params: {
                        id: result.draggableId,
                    },
                    body: {
                        key: "timeline_id",
                        value: result.destination.droppableId,
                    },
                },
            });

            if (todo && targetTimeline) {
                moveTodoToAnotherTimelineSubscription(
                    targetTimeline?._id,
                    result.destination.droppableId,
                    todo,
                );
            }
        } else {
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
        }
    };

    /**
     * Render
     */
    return (
        <DragDropContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <Stack direction={"row"}>
                <MainBox
                    selectedTodoId={selectedTodo?._id}
                    onSelectTodo={handleSelectTodo}
                />
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
