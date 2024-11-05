import { getFullProject } from "@/api/ProjectAPI"
import AddTaskModal from "@/components/tasks/AddTaskModal"
import EditTaskData from "@/components/tasks/EditTaskData"
import TaskList from "@/components/tasks/TaskList"
import TaskModalDetails from "@/components/tasks/TaskModalDetails"
import { useAuth } from "@/hooks/useAuth"
import { isManager } from "@/utils/policies"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"

export default function ProjectDetailsView() {

    const { data: user, isLoading: authLoading } = useAuth()

    const navigate = useNavigate()

    // obtener el id del proyecto
    const params = useParams()
    const projectId = Number(params.projectId)
    
    // react query
    const { data, isLoading, isError } = useQuery({
        queryKey: ['project', projectId], // debe ser unico, le pasamos también el id para cumplirlo
        queryFn: () => getFullProject(projectId), // con un callback, sí se puede pasar parametros a la fn
        retry: false // para que consulte 1 vez la BD
    })

    const canEdit = useMemo(() => data?.manager === user?.id, [data, user])

    if (isLoading && authLoading) return 'Cargando...' // isLoading, es true mientras obtiene los datos de la api
    if (isError) return <Navigate to="/404"/>
    
    if (data && user) return (
        <>
        <h1 className="text-5xl font-black">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>

        {isManager(data.manager, user.id) && (
            <nav className="my-5 flex gap-3">
                <button type="button" onClick={() => navigate(location.pathname + '?newTask=true')} className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors">
                    Agregar tarea
                </button>

                <Link to={'team'} className="bg-fuchsia-500 hover:bg-fuchsia-600 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors">
                    Colaboradores
                </Link>
            </nav>
        )}
     
        
        <TaskList tasks={data.tasks} canEdit={canEdit}/>

        <AddTaskModal/>
        <EditTaskData/>
        <TaskModalDetails/>
        </>
    )
}
