export interface ITodo {
    _id: string;
    title: string;
}

export interface ITimelineRequestData {
    date: string;
}

export interface ITimeline extends ITimelineRequestData {
    _id: string;
    todos: ITodo[];
    checked: boolean;
}
