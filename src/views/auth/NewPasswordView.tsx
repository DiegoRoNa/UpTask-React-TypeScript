import NewPasswordToken from "@/components/auth/NewPasswordToken"
import NewPasswordForm from "@/components/auth/NewPasswordForm"
import { useState } from "react"
import { ConfirmToken } from "@/types/index"

export default function NewPasswordView() {

    const [token, setToken] = useState<ConfirmToken['token']>('')

    const [isValidToken, setIsValidToken] = useState(false)

    return (
        <>
        <h1 className="text-3xl font-black text-white text-center">Reestablecer contraseña</h1>
        <p className="text-lg font-light text-white mt-5 text-center">
            Coloca el código que recibiste <span className="text-fuchsia-500 font-bold"> en tu correo</span>
        </p>

        {!isValidToken ? <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken}/> 
                    : <NewPasswordForm token={token}/>}
        </>
    )
}
