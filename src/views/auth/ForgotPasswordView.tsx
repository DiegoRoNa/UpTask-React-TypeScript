import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { ForgotPasswordForm } from "../../types"
import ErrorMessage from "@/components/ErrorMessage"
import { useMutation } from "@tanstack/react-query"
import { forgotPassword } from "@/api/AuthAPI"
import { toast } from "react-toastify"

export default function ForgotPasswordView() {
    const initialValues: ForgotPasswordForm = {
        email: '',
    }

    const {register, handleSubmit, reset, formState: { errors }} = useForm({ defaultValues: initialValues })

    const {mutate} = useMutation({
        mutationFn: forgotPassword,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
        }
    })

    const handleForgotPassword = (formData: ForgotPasswordForm) => mutate(formData)

    return (
        <>
        <h1 className="text-3xl font-black text-white text-center">Reestablecer contraseña</h1>
        <p className="text-lg font-light text-white mt-5 text-center">
            Coloca tu correo que usaste para crear tu cuenta y <span className="text-fuchsia-500 font-bold"> reestablece tu contraseña</span>
        </p>
        <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-8 p-6 mt-7 bg-white rounded-lg"noValidate>
            <div className="flex flex-col gap-5">
                <label className="font-normal text-lg" htmlFor="email">Correo</label>
                <input id="email" type="email" placeholder="Correo de Registro" className="w-full p-3 border-gray-300 border"
                    {...register("email", {
                        required: "El correo de registro es obligatorio",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Correo no válido"
                        }
                    })}
                />
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </div>

            <input type="submit" value="Enviar Instrucciones" className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-lg cursor-pointer"/>
        </form>

        <nav className="mt-10 flex flex-col space-y-4">
            <Link to={'/auth/login'} className="text-center text-gray-300 hover:text-fuchsia-500 hover:font-bold">
                ¿Ya tienes cuenta?, inicia sesión
            </Link>

            <Link to={'/auth/register'} className="text-center text-gray-300 hover:text-fuchsia-500 hover:font-bold">
                ¿No tienes cuenta?, crea una
            </Link>
        </nav>
        </>
    )
}
