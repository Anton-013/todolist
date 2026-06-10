import { useReorderTodolistMutation } from "../../api/todolistsApi"
import { DragEndEvent } from "@dnd-kit/react"
import { isSortable } from "@dnd-kit/react/sortable"
import { DomainTodolist } from "../types"

export const useTodolistsDnD = (todolists: DomainTodolist[] | undefined) => {

    const [reorderTodolist] = useReorderTodolistMutation()

    const handlerDragEnd = (event: DragEndEvent) => {
        if (!todolists) return
        if (!event.operation.source) return
        if (!isSortable(event.operation.source)) return

        const sourceIndex = event.operation.source.initialIndex
        const newIndex = event.operation.source.index

        if (sourceIndex === newIndex) return

        const putAfterItemId = newIndex > 0 ? todolists[newIndex - 1]?.id : null

        reorderTodolist({
            id: String(event.operation.source.id),
            putAfterItemId,
        })
    }
    return { handlerDragEnd }
}
