import { ITimeline, ITodo } from "@/share/types/timeline";
import { v4 } from "uuid";
import { create } from "zustand";

interface IUseTimeline {
    timelines: ITimeline[];
    target: null | ITimeline;
    onAddTimeline: (timeline: ITimeline) => void;
    onInitTimelines: (timelines: ITimeline[]) => void;
    onSetTarget: (id: string) => void;
    onUpdateTodoInTimeline: (tdId: string, value: ITodo, tlId: string) => void;
    onAddTodoInTimeline: (tlId: string) => void;
    onRemoveTodoInTimeline: (tlId: string, tdId?: string) => void;
    onInitTodosInTimeline: (tlId: string, todos: ITodo[]) => void;
}

export const useTimeline = create<IUseTimeline>((set) => ({
    timelines: [],
    target: null,
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
            target: state.timelines.find((i) => i._id === id),
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
    onAddTodoInTimeline: (tlId: string) =>
        set((state) => ({
            ...state,
            timelines: state.timelines.map((tl) => {
                if (tl._id === tlId) {
                    const newTodo = {
                        _id: v4(),
                        title: "",
                    };
                    tl.todos = [...(tl.todos || []), newTodo];
                    return tl;
                } else {
                    return tl;
                }
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
export const targetTimelineSelector = (state: IUseTimeline) => state.target;

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
export const onRemoveTodoInTimelineSubscription = (state: IUseTimeline) =>
    state.onRemoveTodoInTimeline;
export const onInitTodosInTimelineSubscription = (state: IUseTimeline) =>
    state.onInitTodosInTimeline;
