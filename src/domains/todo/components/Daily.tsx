import Button from "@/share/components/Button";
import Text from "@/share/components/Text";
import { ITimelineRequestData } from "@/share/types/timeline";
import { onSetMessageSubscription, useAlert } from "@/zustand/useAlert";
import { onAddTimelineSubscription, useTimeline } from "@/zustand/useTimeline";
import { Check, ControlPointOutlined } from "@mui/icons-material";
import { Box, Stack, styled } from "@mui/material";
import { Dayjs } from "dayjs";
import { Suspense, lazy, memo, useEffect, useRef, useState } from "react";
import { createTimeline } from "../services/TimelineService";
import Calendar from "./Calendar";

const TaskDates = lazy(() => import("./TaskDates"));

export default memo(function Daily() {
    /**
     * Subscriptions
     */
    const addTimelineSubscription = useTimeline(onAddTimelineSubscription);
    const alertSetMessageSubscription = useAlert(onSetMessageSubscription);

    /**
     * States
     */
    const calendarPickerRef = useRef<any>();
    const [isShowCalendar, setIsShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    /**
     * Effects
     */

    useEffect(() => {
        let handler = (e: any) => {
            if (!calendarPickerRef.current?.contains(e.target)) {
                handleHideCalendar();
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    /**
     * Function definition
     */

    const handleShowCalendar = () => setIsShowCalendar(true);

    const handleHideCalendar = () => setIsShowCalendar(false);

    const handleClickAddTimeline = () => {
        if (isShowCalendar) handleHideCalendar();
        else handleShowCalendar();
    };

    const handleSelectDate = (e: any) => {
        setSelectedDate(e);
    };

    const handleAddDailyTimeline = async () => {
        if (selectedDate) {
            const newTimeline = await createTimeline<ITimelineRequestData>({
                data: { body: { date: selectedDate.format("DD/MM/YYYY") } },
                errorCallbackAction: (err: any) => {
                    alertSetMessageSubscription(
                        typeof err === "string" ? err : err.message,
                        "error",
                    );
                },
            });

            if (newTimeline) {
                addTimelineSubscription(newTimeline);
            }
        }
    };

    /**
     * Render
     */

    return (
        <Box>
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Text title="Daily" variant="h5" />
                <Box ref={calendarPickerRef} sx={{ position: "relative" }}>
                    <Button
                        color={isShowCalendar ? "success" : "primary"}
                        icon={
                            isShowCalendar ? (
                                <Check
                                    sx={{
                                        color: "white",
                                    }}
                                />
                            ) : (
                                <ControlPointOutlined
                                    sx={{
                                        color: "white",
                                    }}
                                />
                            )
                        }
                        onClick={
                            isShowCalendar
                                ? handleAddDailyTimeline
                                : handleClickAddTimeline
                        }
                    />
                    {isShowCalendar && (
                        <CalendarBox>
                            <Calendar
                                value={selectedDate}
                                onChange={handleSelectDate}
                            />
                        </CalendarBox>
                    )}
                </Box>
            </Stack>
            <DailyBox>
                <Suspense fallback={<div>Loading...</div>}>
                    <TaskDates />
                </Suspense>
            </DailyBox>
        </Box>
    );
});

const DailyBox = styled(Stack)(({ theme }) => ({
    marginTop: 20,
}));

const CalendarBox = styled(Box)(({ theme }) => ({
    position: "absolute",
    right: 0,
}));
