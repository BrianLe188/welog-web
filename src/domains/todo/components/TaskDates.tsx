import { memo, useEffect } from "react";
import TaskDate from "./TaskDate";
import { Box } from "@mui/material";
import {
    onInitTimelinesSubscription,
    timelinesSelector,
    useTimeline,
} from "@/zustand/useTimeline";
import { getTimelines } from "../services/TimelineService";
import { onSetMessageSubscription, useAlert } from "@/zustand/useAlert";

export default memo(function TaskDates() {
    /**
     * Subscriptions, Selections
     */
    const timelines = useTimeline(timelinesSelector);
    const initTimelinesSubscription = useTimeline(onInitTimelinesSubscription);
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
                    typeof err === "string" ? err : err.message,
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

    /**
     * Render
     */

    return timelines.map((e) => (
        <Box key={e._id} sx={{ marginBottom: 2 }}>
            <TaskDate key={e._id} data={e} />
        </Box>
    ));
});
