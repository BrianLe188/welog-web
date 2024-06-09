import { ITimeline, ITodo } from "@/share/types/timeline";
import { create } from "zustand";

interface IUseTimeline {
    timelines: ITimeline[];
    isDragging: boolean;
    onSetDragging: (value: boolean) => void;
    onToggleDragging: () => void;
    onAddTimeline: (timeline: ITimeline) => void;
    onInitTimelines: (timelines: ITimeline[]) => void;
    onSetTarget: (id: string) => void;
    onUpdateTodoInTimeline: (tdId: string, value: ITodo, tlId: string) => void;
    onAddTodoInTimeline: (tlId: string, newTodo: ITodo) => void;
    onMoveTodoToAnotherTimeline: (
        frTlId: string,
        toTlId: string,
        todo: ITodo,
    ) => void;
    onRemoveTodoInTimeline: (tlId: string, tdId?: string) => void;
    onInitTodosInTimeline: (tlId: string, todos: ITodo[]) => void;
}

export const useTimeline = create<IUseTimeline>((set) => ({
    timelines: [],
    isDragging: false,
    onSetDragging: (value: boolean) =>
        set((state) => ({
            ...state,
            isDragging: value,
        })),
    onToggleDragging: () =>
        set((state) => ({
            ...state,
            isDragging: !state.isDragging,
        })),
    onAddTimeline: (timeline: ITimeline) =>
        set((state) => ({
            ...state,
            timelines: [...state.timelines, timeline],
        })),
    onInitTimelines: (timelines: ITimeline[]) =>
        set((state) => ({
            ...state,
            target: timelines[0],
            timelines,
        })),
    onSetTarget: (id: string) =>
        set((state) => ({
            ...state,
            timelines: state.timelines.map((i) => {
                if (i._id === id) i.checked = true;
                else i.checked = false;

                return i;
            }),
        })),
    onUpdateTodoInTimeline: (tdId: string, value: ITodo, tlId: string) =>
        set((state) => ({
            ...state,
            timelines: state.timelines.map((tl) => {
                if (tl._id === tlId) {
                    tl.todos = tl.todos.map((td) => {
                        if (td._id === tdId) td = value;
                        return td;
                    });
                    return tl;
                } else {
                    return tl;
                }
            }),
        })),
    onAddTodoInTimeline: (tlId: string, newTodo: ITodo) =>
        set((state) => ({
            ...state,
            timelines: state.timelines.map((tl) => {
                if (tl._id === tlId) {
                    tl.todos = [...(tl.todos || []), newTodo];
                    return tl;
                } else {
                    return tl;
                }
            }),
        })),
    onMoveTodoToAnotherTimeline: (
        frTlId: string,
        toTlId: string,
        todo: ITodo,
    ) =>
        set((state) => ({
            ...state,
            timelines: state.timelines.map((tl) => {
                if (tl._id === frTlId) {
                    tl.todos = tl.todos.filter((td) => td._id !== todo._id);
                    return tl;
                }

                if (tl._id === toTlId) {
                    tl.todos = [...tl.todos, todo].sort(
                        (a, b) => a.order - b.order,
                    );
                    return tl;
                }

                return tl;
            }),
        })),
    onRemoveTodoInTimeline: (tlId: string, tdId?: string) =>
        set((state) => ({
            ...state,
            timelines: state.timelines.map((tl) => {
                if (tl._id === tlId) {
                    tl.todos = tdId
                        ? tl.todos.filter((td) => td._id !== tdId)
                        : tl.todos.filter((td) => td.title.trim());
                    return tl;
                } else {
                    return tl;
                }
            }),
        })),
    onInitTodosInTimeline: (tlId: string, todos: ITodo[]) =>
        set((state) => ({
            ...state,
            timelines: state.timelines.map((tl) => {
                if (tl._id === tlId) tl.todos = todos;
                return tl;
            }),
        })),
}));

export const timelinesSelector = (state: IUseTimeline) => state.timelines;
export const isDraggingSelector = (state: IUseTimeline) => state.isDragging;

export const onSetDraggingSubscription = (state: IUseTimeline) =>
    state.onSetDragging;
export const onToggleDraggingSubscription = (state: IUseTimeline) =>
    state.onToggleDragging;
export const onAddTimelineSubscription = (state: IUseTimeline) =>
    state.onAddTimeline;
export const onInitTimelinesSubscription = (state: IUseTimeline) =>
    state.onInitTimelines;
export const onSetTargetSubscription = (state: IUseTimeline) =>
    state.onSetTarget;
export const onUpdateTodoInTimelineSubscription = (state: IUseTimeline) =>
    state.onUpdateTodoInTimeline;
export const onAddTodoInTimelineSubscription = (state: IUseTimeline) =>
    state.onAddTodoInTimeline;
export const onMoveTodoToAnotherTimelineSubscription = (state: IUseTimeline) =>
    state.onMoveTodoToAnotherTimeline;
export const onRemoveTodoInTimelineSubscription = (state: IUseTimeline) =>
    state.onRemoveTodoInTimeline;
export const onInitTodosInTimelineSubscription = (state: IUseTimeline) =>
    state.onInitTodosInTimeline;
