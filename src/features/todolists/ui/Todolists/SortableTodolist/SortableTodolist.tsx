import { TodolistItem } from "../TodolistItem/TodolistItem"
import { DomainTodolist } from "@/features/todolists/lib/types"
import { useSortable } from "@dnd-kit/react/sortable"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"

export const SortableTodolist = ({ todolist, index }: { todolist: DomainTodolist, index: number }) => {
    const { ref } = useSortable({ id: todolist.id, index })
    return (
        <Grid ref={ref} key={todolist.id}>
            <Paper sx={{ p: "0 20px 20px 20px" }}>
                <TodolistItem todolist={todolist} />
            </Paper>
        </Grid>
    )
}
