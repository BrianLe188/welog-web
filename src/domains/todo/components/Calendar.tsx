import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Paper, styled } from "@mui/material";
import { Dayjs } from "dayjs";

interface ICalendarProps {
    value: Dayjs | null;
    onChange: (e?: any) => void;
}

export default function Calendar({ value, onChange }: ICalendarProps) {
    return (
        <CalendarPaper>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar value={value} onChange={onChange} />
            </LocalizationProvider>
        </CalendarPaper>
    );
}

const CalendarPaper = styled(Paper)(({ theme }) => ({
    borderRadius: 15,
}));
