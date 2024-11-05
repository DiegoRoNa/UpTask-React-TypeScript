import api from "@/lib/axios"
import { isAxiosError } from "axios"
import { UpdateCurrentUserPasswordForm, UserProfileForm } from "../types"

export async function updateProfile(formData : UserProfileForm) {
    try {
        const { data } = await api.put<string>('/auth/profile', formData)
        return data      

    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

export async function changePassword(formData : UpdateCurrentUserPasswordForm) {
    try {
        const { data } = await api.post<string>('/auth/update-password', formData)
        return data      

    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}