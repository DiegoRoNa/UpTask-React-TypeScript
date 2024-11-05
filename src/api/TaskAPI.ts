import api from "@/lib/axios"
import { isAxiosError } from "axios"
import { Project, Task, TaskFormData, taskSchema } from "../types"

type TaskAPIType = {
    formData: TaskFormData
    projectId: Project['id']
    taskId: Task['id']
    status: Task['status']
}

/**
 * Peticion para crear una tarea
 * @param param0 formData: Datos del form. projectId: ID del proyecto
 * @returns 
 */
export async function createTask({ formData, projectId } : Pick<TaskAPIType, 'formData' | 'projectId'>) {
    try {
        // no ponemos axios.post, ya que se creo un cliente de axios
        // y le pusimos la url base, por eso solo ponemos /projects
        const { data } = await api.post<string>(`/projects/${projectId}/tasks`, formData)
        return data
    } catch (error) {

        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

/**
 * Peticion para obtener una tarea
 * @param id ID de la tarea
 * @returns 
 */
export async function getTaskById({projectId, taskId} : Pick<TaskAPIType, 'projectId' | 'taskId'>) {
    try {

        const { data } = await api(`projects/${projectId}/tasks/${taskId}`)
        const result = taskSchema.safeParse(data)
        
        if (result.success) {
            return result.data
        }
    } catch (error) {

        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

/**
 * Peticion para editar una tarea
 */
export async function updateTask({projectId, taskId, formData} : Pick<TaskAPIType, 'projectId' | 'taskId' | 'formData'>) {
    try {

        const { data } = await api.put<string>(`projects/${projectId}/tasks/${taskId}`, formData)
        return data
    } catch (error) {

        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

/**
 * Peticion para eliminar una tarea
 * @param id ID de la tarea
 * @returns 
 */
export async function deleteTask({projectId, taskId} : Pick<TaskAPIType, 'projectId' | 'taskId'>) {
    try {
        const { data } = await api.delete<string>(`projects/${projectId}/tasks/${taskId}`)
        return data
    } catch (error) {

        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

/**
 * Peticion para actualizar el estatus de una tarea
 */
export async function updateStatus({projectId, taskId, status} : Pick<TaskAPIType, 'projectId' | 'taskId' | 'status'>) {
    try {

        const { data } = await api.post<string>(`projects/${projectId}/tasks/${taskId}/status`, {status})
        return data
    } catch (error) {

        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}