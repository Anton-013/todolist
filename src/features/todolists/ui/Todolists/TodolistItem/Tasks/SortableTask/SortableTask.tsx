import { DomainTask } from "@/features/todolists/api/tasksApi.types"
import { useSortable } from "@dnd-kit/react/sortable"
import { TaskItem } from "../TaskItem/TaskItem"
import { DomainTodolist } from "@/features/todolists/lib/types"

export const SortableTask = ({ todolist, task, index }: { todolist: DomainTodolist, task: DomainTask, index: number }) => {
    const { ref } = useSortable({ id: task.id, index })
    return (
        <div ref={ref}>
            <TaskItem key={task.id} task={task} todolist={todolist} />
        </div>
    )
}