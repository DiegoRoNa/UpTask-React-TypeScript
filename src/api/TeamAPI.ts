import api from "@/lib/axios"
import { isAxiosError } from "axios"
import { Project, TeamMember, TeamMemberForm, teamMembersSchema } from "../types"

export async function findUserByEmail({projectId, formData} : {projectId : Project['id'], formData : TeamMemberForm}) {
    try {
        const { data } = await api.post(`/projects/${projectId}/team/find`, formData)
        return data  

    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

export async function addUserToProject({projectId, id} : {projectId : Project['id'], id : TeamMember['id']}) {
    try {
        const { data } = await api.post<string>(`/projects/${projectId}/team`, {id})
        return data  

    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

export async function getProjectTeam(projectId : Project['id']) {
    try {
        const { data } = await api(`/projects/${projectId}/team`)
        const response = teamMembersSchema.safeParse(data.team)

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

export async function removeUserFromProject({projectId, userid} : {projectId : Project['id'], userid : TeamMember['id']}) {
    try {
        const { data } = await api.delete<string>(`/projects/${projectId}/team/${userid}`)
        return data  

    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}