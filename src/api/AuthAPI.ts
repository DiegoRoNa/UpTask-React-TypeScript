import api from "@/lib/axios"
import { isAxiosError } from "axios"
import { CheckPasswordForm, ConfirmToken, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, UserLoginForm, UserRegistrationForm, userSchema } from "../types"

/**
 * Peticion para crear registrar usuario
 * @param data Datos del formulario
 */
export async function createAccount(formData : UserRegistrationForm) {
    try {
        const { data } = await api.post<string>('/auth/create-account', formData)
        return data        
    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

/**
 * Peticion para confirmar cuenta
 */
export async function confirmAccount(formData : ConfirmToken) {
    try {

        const { data } = await api.post<string>('/auth/confirm-account', formData)
        return data
    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

/**
 * Peticion para solicitar nuevo código
 */
export async function requestConfirmationCode(formData : RequestConfirmationCodeForm) {
    try {
        const { data } = await api.post<string>('/auth/request-code', formData)
        return data
    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

/**
 * Peticion para iniciar sesion
 */
export async function authenticateUser(formData : UserLoginForm) {
    try {
        const { data } = await api.post<string>('/auth/login', formData)

        localStorage.setItem('AUTH_TOKEN_UPTASK', data)
        
        return data
    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

/**
 * Peticion para reestablecer contraseña
 */
export async function forgotPassword(formData : ForgotPasswordForm) {
    try {
        const { data } = await api.post<string>('/auth/forgot-password', formData)
        return data
    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

/**
 * Peticion para reestablecer contraseña
 */
export async function validateToken(formData : ConfirmToken) {
    try {
        const { data } = await api.post<string>('/auth/validate-token', formData)
        return data
    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}


/**
 * Peticion para guardar nueva contraseña
 */
export async function updatePasswordWithToken({formData, token} : {formData : NewPasswordForm, token : ConfirmToken['token']}) {
    try {
        const { data } = await api.post<string>(`/auth/update-password/${token}`, formData)
        return data
    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}

/**
 * Metodo para obtener un usuario
 */
export async function getUser() {
    try {
        const { data } = await api('/auth/user')
        const response = userSchema.safeParse(data)

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
 * Metodo para validar contraseña
 */
export async function checkPassword(formData : CheckPasswordForm) {
    try {
        const { data } = await api.post<string>('/auth/check-password', formData)
        return data
    } catch (error) {
        // validar si el error es de axios y que exista un error en error.response
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error) // el ultimo .error, se declara en la api
        }
    }
}