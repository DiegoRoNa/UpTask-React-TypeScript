import { getProjectById } from "@/api/ProjectAPI"
import EditProjectForm from "@/components/projects/EditProjectForm"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"

export default function EditProjectView() {

    // obtener el id del proyecto
    const params = useParams()
    const projectId = Number(params.projectId)
    
    // react query
    const { data, isLoading, isError } = useQuery({
        queryKey: ['editProject', projectId], // debe ser unico, le pasamos también el id para cumplirlo
        queryFn: () => getProjectById(projectId), // con un callback, sí se puede pasar parametros a la fn
        retry: false // para que consulte 1 vez la BD
    })

    if (isLoading) return 'Cargando...' // isLoading, es true mientras obtiene los datos de la api
    if (isError) return <Navigate to="/404"/>
    
    if (data) return <EditProjectForm data={data} projectId={projectId}/>
}
