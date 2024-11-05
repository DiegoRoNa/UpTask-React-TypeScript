import api from "@/lib/axios"
import { dashboardProjectSchema, editProjectSchema, Project, ProjectFormData, projectSchema } from "../types"
import { isAxiosError } from "axios"

/**
 * Peticion para obtener todos los proyectos
 */
export async function getProjects() {
    
    try {
        // no ponemos axios, ya que se creo un cliente de axios
        // y le pusimos la url base, por eso solo ponemos /projects
        const { data } = await api('/projects')
        const response = dashboardProjectSchema.safeParse(data) // validar schema del array
        
        if (response.success) {
            return response.data
        }

    } catch (error) {

        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

/**
 * Peticion para crear un proyecto
 * @param data Datos del formulario
 */
export async function createProject(formData : ProjectFormData) {
    try {
        // no ponemos axios.post, ya que se creo un cliente de axios
        // y le pusimos la url base, por eso solo ponemos /projects
        const { data } = await api.post('/projects', formData)
        return data        
    } catch (error) {

        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

/**
 * Peticion para obtener un proyecto
 */
export async function getProjectById(id : Project['id']) {
    try {

        const { data } = await api(`/projects/${id}`)
        console.log(data)
        const response = editProjectSchema.safeParse(data)

        if (response.success) {
            return response.data
        }

    } catch (error) {

        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

/**
 * Peticion para obtener toda la informacion de un proyecto
 */
export async function getFullProject(id : Project['id']) {
    try {

        const { data } = await api(`/projects/${id}`)
        const response = projectSchema.safeParse(data)

        if (response.success) {
            return response.data
        }
        
    } catch (error) {

        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

type ProjectAPIType = {
    formData: ProjectFormData
    projectId: Project['id']
}

/**
 * Peticion para editar un proyecto
 */
export async function updateProject({ formData, projectId } : ProjectAPIType) {
    try {

        const { data } = await api.put<string>(`/projects/${projectId}`, formData)
        return data
    } catch (error) {

        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

/**
 * Peticion para eliminar un proyecto
 */
export async function deleteProject(id : Project['id']) {
    try {

        const { data } = await api.delete<string>(`/projects/${id}`)
        return data
    } catch (error) {

        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}