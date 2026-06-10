import { DragEndEvent } from "@dnd-kit/react"
import { useReorderTaskMutation } from "../../api/tasksApi"
import { DomainTask } from "../../api/tasksApi.types"
import { isSortable } from "@dnd-kit/react/sortable"

export const useTasksDnD = ({ tasks, todolistId }: { tasks: DomainTask[] | undefined, todolistId: string }) => {

    const [reorderTask] = useReorderTaskMutation()

    const handlerDragEnd = (event: DragEndEvent) => {
        if (!tasks) return
        if (!event.operation.source) return
        if (!isSortable(event.operation.source)) return

        const sourceIndex = event.operation.source.initialIndex
        const newIndex = event.operation.source.index

        if (sourceIndex === newIndex) return

        const putAfterItemId = newIndex > 0 ? tasks[newIndex - 1]?.id : null

        reorderTask({
            todolistId,
            taskId: String(event.operation.source.id),
            putAfterItemId,
        })
    }
    return { handlerDragEnd }
}
