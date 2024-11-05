import { getTaskById } from "@/api/TaskAPI"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router-dom"
import EditTaskModal from "./EditTaskModal"

export default function EditTaskData() {
    
    // obtener proyecto
    const params = useParams()
    const projectId = Number(params.projectId)

    // obtener querystring de la url para el modal
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = Number(queryParams.get('editTask'))

    const { data, isError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({projectId, taskId}),
        enabled: !!taskId, // "!!", convierte un valor en boolean, si hay algo es true, si no es false
        retry: false
    })

    if (isError) return <Navigate to={'/404'}/>

    if (data) return <EditTaskModal data={data} taskId={taskId}/>
}
