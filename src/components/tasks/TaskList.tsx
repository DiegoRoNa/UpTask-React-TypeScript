import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTranslitions } from "@/locales/es"
import DropTask from "./DropTask"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import { updateStatus } from "@/api/TaskAPI"

type TaskListProps = {
    tasks: TaskProject[]
    canEdit: boolean
}

type GroupedTasks = {
    [key: string] : TaskProject[]
}

const initialStatusGroup : GroupedTasks = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: []
}

const statusStyles : {[key: string] : string} = {
    pending: 'border-t-slate-500',
    onHold: 'border-t-red-500',
    inProgress: 'border-t-blue-500',
    underReview: 'border-t-amber-500',
    completed: 'border-t-emerald-500'
}

export default function TaskList({tasks, canEdit} : TaskListProps) {

    // obtener proyecto
    const params = useParams()
    const projectId = Number(params.projectId)

    // obtener querystring de la url para el modal
    // const location = useLocation()
    // const queryParams = new URLSearchParams(location.search)
    // const taskId = Number(queryParams.get('viewTask'))

    // react query
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['project', projectId]}) // proyecto actualizado
            toast.success(data)
        }
    })

    // agrupar tareas de acuerdo a su estatus
    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : []
        currentGroup = [...currentGroup, task]
        return { ...acc, [task.status]: currentGroup }
    }, initialStatusGroup)

    const handleDragEnd = (e: DragEndEvent) => {
        const { over, active } = e

        // soltar elemento en un drop válido
        if (over && over.id) {
            const taskId = Number(active.id) // este id viene de useDraggable desde TaskCard
            const status = over.id as TaskStatus // este id viene de useDroppable desde DropTask

            mutate({projectId, taskId, status}) // enviar datos

            // actualizar state manualmente
            queryClient.setQueryData(['project', projectId], (prevData : Project) => {

                // state actualizado
                const updatedTasks = prevData.tasks.map((task) => {

                    if (task.id === taskId) {
                        return {
                            ...task,
                            status
                        }    
                    }

                    return task

                })

                return {
                    ...prevData,
                    tasks: updatedTasks
                }
            })
        }
    }

    return (
        <>
        <h2 className="text-5xl font-black my-10">Tareas</h2>

        <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
            <DndContext onDragEnd={handleDragEnd}>
                {Object.entries(groupedTasks).map(([status, tasks]) => (
                    <div key={status} className='min-w-[240px] 2xl:min-w-0 2xl:w-1/5'>

                        <h3 className={`capitalize text-lg font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}>{statusTranslitions[status]}</h3>

                        <DropTask status={status}/>

                        <ul className='mt-5 space-y-5'>
                            {tasks.length === 0 ? (
                                <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                            ) : (
                                tasks.map(task => <TaskCard key={task.id} task={task} canEdit={canEdit}/>)
                            )}
                        </ul>
                    </div>
                ))}
            </DndContext>
        </div>
        </>
    )
}
