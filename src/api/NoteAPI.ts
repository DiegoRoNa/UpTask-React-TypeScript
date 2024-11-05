import api from "@/lib/axios"
import { isAxiosError } from "axios"
import { Note, NoteFormData, Project, Task } from "../types"

type NoteAPIType = {
    formData: NoteFormData
    projectId: Project['id']
    taskId: Task['id']
    noteId: Note['id']
}

export async function createNote({projectId, taskId, formData} : Pick<NoteAPIType, 'projectId' | 'taskId' | 'formData'>) {
    try {
        const { data } = await api.post<string>(`/projects/${projectId}/tasks/${taskId}/notes`, formData)
        return data      

    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

export async function deleteNote({projectId, taskId, noteId} : Pick<NoteAPIType, 'projectId' | 'taskId' | 'noteId'>) {
    try {
        const { data } = await api.delete<string>(`/projects/${projectId}/tasks/${taskId}/notes/${noteId}`)
        return data      

    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}