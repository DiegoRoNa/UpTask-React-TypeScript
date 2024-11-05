import { validateToken } from '@/api/AuthAPI'
import { ConfirmToken } from '@/types/index'
import { PinInput, PinInputField } from '@chakra-ui/pin-input'
import { useMutation } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

type NewPasswordTokenProps = {
    token: ConfirmToken['token']
    setToken: Dispatch<SetStateAction<string>>
    setIsValidToken: Dispatch<SetStateAction<boolean>>
}

export default function NewPasswordToken({token, setToken, setIsValidToken} : NewPasswordTokenProps) {
    
    const {mutate} = useMutation({
        mutationFn: validateToken,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            setIsValidToken(true)
        }
    })

    // este token, es antes de escribirlo
    const handleChange = (token: ConfirmToken['token']) => setToken(token)

    // este token, es después de escribirlo
    const handleComplete = (token: ConfirmToken['token']) => mutate({token})

    return (
        <>
            <form className="space-y-8 p-6 rounded-lg bg-white mt-7">
                <label className="font-normal text-lg text-center block">Código de 6 dígitos</label>
                <div className="flex justify-center gap-4">
                    <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                        <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                    </PinInput>
                </div>
            </form>
            <nav className="mt-10 flex flex-col space-y-4">
                <Link to='/auth/forgot-password' className="text-center text-gray-300 hover:text-fuchsia-500 hover:font-bold">
                    Solicitar un nuevo Código
                </Link>
            </nav>
        </>
    )
}