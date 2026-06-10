import { TaskStatus } from "@/common/enums"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi"
import type { DomainTodolist } from "@/features/todolists/lib/types"
import List from "@mui/material/List"
import { TaskItem } from "./TaskItem/TaskItem"
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton"
import { useState } from "react"
import { TasksPagination } from "./TasksPagination/TasksPagination"
import { PAGE_SIZE } from "@/common/constants"
import { DragDropProvider } from "@dnd-kit/react"
import { SortableTask } from "./SortableTask/SortableTask"
import { useTasksDnD } from "@/features/todolists/lib/hooks/useTasksDnD"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetTasksQuery({ todolistId: id, params: { page } })
  const { handlerDragEnd } = useTasksDnD({ tasks: data?.items, todolistId: id })

  let filteredTasks = data?.items
  if (filter === "active") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <>
          {filter === 'all' ? (
            <DragDropProvider onDragEnd={handlerDragEnd}>
              <List>
                {data?.items?.map((task, index) => (
                  <SortableTask key={task.id} todolist={todolist} task={task} index={index} />
                ))}
              </List>
            </DragDropProvider>
          ) : (
            <List>
              {filteredTasks?.map((task) => <TaskItem key={task.id} task={task} todolist={todolist} />)}
            </List>
          )}
          {data && (data.totalCount > PAGE_SIZE) && <TasksPagination page={page} setPage={setPage} totalCount={data.totalCount} />}
        </>
      )}
    </>
  )
}
