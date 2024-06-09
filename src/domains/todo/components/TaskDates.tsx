import { memo, useEffect } from "react";
import TaskDate from "./TaskDate";
import { Box } from "@mui/material";
import {
    isDraggingSelector,
    onInitTimelinesSubscription,
    onSetTargetSubscription,
    timelinesSelector,
    useTimeline,
} from "@/zustand/useTimeline";
import { getTimelines } from "../services/TimelineService";
import { onSetMessageSubscription, useAlert } from "@/zustand/useAlert";
import { ITimeline } from "@/share/types/timeline";
import { Droppable } from "react-beautiful-dnd";

export default memo(function TaskDates() {
    /**
     * Subscriptions, Selections
     */
    const timelines = useTimeline(timelinesSelector);
    const isDragging = useTimeline(isDraggingSelector);
    const initTimelinesSubscription = useTimeline(onInitTimelinesSubscription);
    const setTargetTimelineSubscription = useTimeline(onSetTargetSubscription);
    const alertSetMessageSubscription = useAlert(onSetMessageSubscription);

    /**
     * Effects
     */

    useEffect(() => {
        handleGetTimelines();
    }, []);

    /**
     * Function definition
     */

    const handleGetTimelines = async () => {
        const response = await getTimelines({
            data: { query: {} },
            errorCallbackAction: (err: any) => {
                alertSetMessageSubscription(
                    err.response?.data?.message,
                    "error",
                );
            },
        });

        if (response) {
            initTimelinesSubscription(
                response.map((e, i) => ({
                    ...e,
                    checked: i === 0,
                })),
            );
        }
    };

    const handleClick = (data: ITimeline) => {
        setTargetTimelineSubscription(data._id);
    };

    /**
     * Render
     */

    return timelines.map((e) => (
        <Droppable droppableId={e._id} key={e._id}>
            {(provided, snapshot) => {
                return (
                    <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{ marginBottom: 2 }}
                    >
                        <TaskDate
                            key={e._id}
                            data={e}
                            onClick={handleClick}
                            isDragging={isDragging}
                            isDraggingOver={snapshot.isDraggingOver}
                        />
                    </Box>
                );
            }}
        </Droppable>
    ));
});
