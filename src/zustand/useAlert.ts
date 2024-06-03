import { AlertColor } from "@mui/material";
import { create } from "zustand";

interface IUseAlert {
    message: string;
    show: boolean;
    severity: AlertColor;
    onShow: () => void;
    onHide: () => void;
    onSetMessage: (message: string, severity?: AlertColor) => void;
}

export const useAlert = create<IUseAlert>((set) => ({
    message: "",
    show: false,
    severity: "success",
    onShow: () => set((state) => ({ ...state, show: true })),
    onHide: () => set((state) => ({ ...state, show: false })),
    onSetMessage: (message: string, severity?: AlertColor) =>
        set((state) => ({
            ...state,
            message,
            show: true,
            ...(severity ? { severity } : {}),
        })),
}));

export const messageSelector = (state: IUseAlert) => state.message;
export const showSelector = (state: IUseAlert) => state.show;
export const fullInfoSelector = (state: IUseAlert) => ({
    message: state.message,
    show: state.show,
    severity: state.severity,
});

export const onShowSubscription = (state: IUseAlert) => state.onShow;
export const onHideSubscription = (state: IUseAlert) => state.onHide;
export const onSetMessageSubscription = (state: IUseAlert) =>
    state.onSetMessage;
