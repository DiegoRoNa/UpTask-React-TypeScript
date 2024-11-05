import type { ConfirmToken, NewPasswordForm } from "../../types"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import ErrorMessage from "@/components/ErrorMessage"
import { useMutation } from "@tanstack/react-query"
import { updatePasswordWithToken } from "@/api/AuthAPI"
import { toast } from "react-toastify"

type NewPasswordFormProps = {
    token: ConfirmToken['token']
}

export default function NewPasswordForm({token} : NewPasswordFormProps) {
    const navigate = useNavigate()

    const initialValues: NewPasswordForm = {
        password: '',
        password_confirmation: '',
    }

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    const {mutate} = useMutation({
        mutationFn: updatePasswordWithToken,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            navigate('/auth/login')
        }
    })

    const handleNewPassword = (formData: NewPasswordForm) => {
        const data = {
            formData,
            token
        }

        mutate(data)
    }

    const password = watch('password')

    return (
        <>
            <form onSubmit={handleSubmit(handleNewPassword)} className="space-y-8 p-6 bg-white mt-7 rounded-lg" noValidate>

                <div className="flex flex-col gap-5">
                    <label className="font-normal text-lg">Contraseña</label>

                    <input type="password" placeholder="Contraseña de Registro" className="w-full p-3 border-gray-300 border"
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: {
                                value: 8,
                                message: "La contraseña debe ser mínimo de 8 caracteres"
                            }
                        })}
                    />
                    {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </div>

                <div className="flex flex-col gap-5">
                    <label className="font-normal text-lg">Repetir contraseña</label>

                    <input id="password_confirmation" type="password" placeholder="Repite contraseña de Registro" className="w-full p-3 border-gray-300 border"
                        {...register("password_confirmation", {
                            required: "Repite la contraseña",
                            validate: value => value === password || "Las contraseñas no son iguales"
                        })}
                    />

                    {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>}
                </div>

                <input type="submit" value='Guardar contraseña' className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-lg cursor-pointer"/>
            </form>
        </>
    )
}