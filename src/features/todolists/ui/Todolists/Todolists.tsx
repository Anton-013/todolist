import { containerSx } from "@/common/styles"
import { useGetTodolistsQuery } from "@/features/todolists/api/todolistsApi"
import Box from "@mui/material/Box"
import { TodolistSkeleton } from "./TodolistSkeleton/TodolistSkeleton"
import { DragDropProvider } from '@dnd-kit/react';
import { SortableTodolist } from "./SortableTodolist/SortableTodolist";
import { useTodolistsDnD } from "../../lib/hooks/useTodolistsDnD";

export const Todolists = () => {

  const { data: todolists, isLoading } = useGetTodolistsQuery()
  const { handlerDragEnd } = useTodolistsDnD(todolists)

  if (isLoading) {
    return (
      <Box sx={containerSx} style={{ gap: "32px" }}>
        {Array(3)
          .fill(null)
          .map((_, id) => (
            <TodolistSkeleton key={id} />
          ))}
      </Box>
    )
  }

  return (
    <>
      <DragDropProvider onDragEnd={handlerDragEnd}>
        {todolists?.map((todolist, index) => {
          return <SortableTodolist index={index} todolist={todolist} key={todolist.id} />
        })}
      </DragDropProvider>
    </>
  )
}
