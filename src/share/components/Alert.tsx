import { Snackbar, Alert as MUIAlert, AlertProps } from "@mui/material";

interface IAlertProps extends AlertProps {
    open?: boolean;
    autoHideDuration?: number;
    message: string;
    onClose?: () => void;
}

export default function Alert({
    open,
    autoHideDuration = 6000,
    severity,
    variant,
    message,
    onClose,
}: IAlertProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={() => onClose && onClose()}
        >
            <MUIAlert
                onClose={() => onClose && onClose()}
                severity={severity}
                variant={variant}
                sx={{ width: "100%" }}
            >
                {message}
            </MUIAlert>
        </Snackbar>
    );
}
