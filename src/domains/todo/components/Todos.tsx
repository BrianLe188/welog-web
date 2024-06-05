import { Draggable } from "react-beautiful-dnd";
import Todo from "./Todo";
import { Box } from "@mui/material";
import { ITodo } from "@/share/types/timeline";

interface ITodosProps {
    tlId?: string;
    todos: ITodo[];
    selectedTodo: ITodo | undefined;
    onUpdateTodo: (id: string, value: ITodo) => void;
    onRemoveTodo: (id?: string) => void;
    onSelectTodo: (todo: ITodo) => void;
}

export default function Todos({
    tlId,
    todos,
    selectedTodo,
    onUpdateTodo,
    onRemoveTodo,
    onSelectTodo,
}: ITodosProps) {
    return todos?.map((e, i) => (
        <Draggable index={i} key={e._id} draggableId={e._id}>
            {(provided, snapshot) => (
                <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{ marginBottom: 2 }}
                >
                    <Todo
                        data={{
                            ...e,
                            tlId,
                        }}
                        onSubmit={(e) => onUpdateTodo(e._id, e)}
                        onRemove={onRemoveTodo}
                        onClick={() => e.title && onSelectTodo(e)}
                        isDragging={snapshot.isDragging}
                        isActive={selectedTodo?._id === e._id}
                    />
                </Box>
            )}
        </Draggable>
    ));
}
