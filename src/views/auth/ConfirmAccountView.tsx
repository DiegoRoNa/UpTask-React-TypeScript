import { confirmAccount } from "@/api/AuthAPI";
import { ConfirmToken } from "@/types/index";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ConfirmAccountView() {

    const navigate = useNavigate()

    const [token, setToken] = useState<ConfirmToken['token']>('')

    const {mutate} = useMutation({
        mutationFn: confirmAccount,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate('/auth/login')
        }
    })

    const handleChange = (token : ConfirmToken['token']) => { // este token, es antes de escribirlo
        setToken(token)
    }

    const handleComplete = (token : ConfirmToken['token']) => { // este token, es después de escribirlo
        mutate({token}) // la api espera un obj
    }

    return (
        <>
            <h1 className="text-3xl font-black text-white text-center">Confirma tu Cuenta</h1>
            <p className="text-lg font-light text-white mt-5 text-center">
                Ingresa el código que recibiste <span className="text-fuchsia-500 font-bold"> por correo</span>
            </p>
            
            <form className="space-y-8 p-6 bg-white mt-7 rounded-lg">
                <label className="font-normal text-lg text-center block">Código de 6 dígitos</label>
                
                <div className="flex justify-center gap-4">
                    <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border border-gray-300 placholder-white"/>
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border border-gray-300 placholder-white"/>
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border border-gray-300 placholder-white"/>
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border border-gray-300 placholder-white"/>
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border border-gray-300 placholder-white"/>
                        <PinInputField className="w-10 h-10 p-3 rounded-lg border border-gray-300 placholder-white"/>
                    </PinInput>
                </div>
            </form>

            <nav className="mt-10 flex flex-col space-y-4">
                <Link to='/auth/request-code' className="text-center text-gray-300 hover:text-fuchsia-500 hover:font-bold">
                    Solicitar un nuevo Código
                </Link>
            </nav>

        </>
    )
}