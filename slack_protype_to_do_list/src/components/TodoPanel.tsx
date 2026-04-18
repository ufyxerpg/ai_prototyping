import { useState } from "react";
import { X, Plus, ListTodo } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export interface TodoItem {
  id: string;
  text: string;
  author: string;
  done: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onAdd: (text: string) => void;
}

const TodoPanel = ({ open, onClose, todos, onToggle, onAdd }: Props) => {
  const [newTask, setNewTask] = useState("");

  if (!open) return null;

  const handleAdd = () => {
    const trimmed = newTask.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewTask("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="w-80 shrink-0 border-l bg-card flex flex-col h-full">
      <div className="h-16 px-5 flex items-center justify-between border-b shrink-0">
        <div className="flex items-center gap-2">
          <ListTodo className="size-5 text-primary" />
          <h2 className="font-semibold text-lg">To-Do List</h2>
        </div>
        <button
          onClick={onClose}
          className="size-8 rounded-xl hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* New task input */}
      <div className="p-4 border-b flex gap-2">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 rounded-xl border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          onClick={handleAdd}
          disabled={!newTask.trim()}
          className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1"
        >
          <Plus className="size-4" />
          Add
        </button>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {todos.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No tasks yet. Add one above!</p>
        )}
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-start gap-3 p-3 rounded-xl border bg-background hover:bg-muted/30 transition-colors"
          >
            <Checkbox
              checked={todo.done}
              onCheckedChange={() => onToggle(todo.id)}
              className="mt-0.5"
            />
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className={`text-sm leading-snug ${todo.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {todo.text}
              </span>
              <span className="text-xs text-muted-foreground">{todo.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoPanel;
