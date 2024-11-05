import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RequestConfirmationCodeForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { requestConfirmationCode } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function RegisterView() {
    const initialValues: RequestConfirmationCodeForm = {
        email: ''
    }

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const {mutate} = useMutation({
        mutationFn: requestConfirmationCode,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
        }
    })

    const handleRequestCode = (formData: RequestConfirmationCodeForm) => mutate(formData)

    return (
        <>
            <h1 className="text-3xl font-black text-white text-center">Solicitar Código de Confirmación</h1>
            <p className="text-lg font-light text-white mt-5 text-center">
                Coloca tu correo para recibir <span className="text-fuchsia-500 font-bold">un nuevo código</span>
            </p>

            <form onSubmit={handleSubmit(handleRequestCode)} className="space-y-8 p-6 rounded-lg bg-white mt-10" noValidate>
                <div className="flex flex-col gap-5">
                    <label className="font-normal text-lg" htmlFor="email">Correo</label>
                    <input id="email" type="email" placeholder="Correo de Registro" className="w-full p-3 rounded-lg border-gray-300 border"
                        {...register("email", {
                            required: "El correo de registro es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Correo no válido",
                            },
                        })}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <input type="submit" value='Enviar Código' className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 rounded-lg text-white font-black text-lg cursor-pointer"
                />
            </form>

            <nav className="mt-10 flex flex-col space-y-4">
                <Link to='/auth/login' className="text-center text-gray-300 hover:text-fuchsia-500 hover:font-bold">
                    ¿Ya tienes cuenta? Iniciar Sesión
                </Link>
                <Link to='/auth/forgot-password' className="text-center text-gray-300 hover:text-fuchsia-500 hover:font-bold">
                    ¿Olvidaste tu contraseña? Reestablecer
                </Link>
            </nav>
        </>
    )
}