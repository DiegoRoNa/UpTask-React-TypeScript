import { useForm } from "react-hook-form"
import { UserLoginForm } from "@/types/index"
import ErrorMessage from "@/components/ErrorMessage"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { authenticateUser } from "@/api/AuthAPI"
import { toast } from "react-toastify"

export default function LoginView() {

    const navigate = useNavigate()

    const initialValues: UserLoginForm = {
        email: "",
        password: "",
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const {mutate} = useMutation({
        mutationFn: authenticateUser,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            navigate('/')
        }
    })

    const handleLogin = (formData: UserLoginForm) => mutate(formData)

    return (
        <>
        <h1 className="text-3xl font-black text-white text-center">Iniciar sesión</h1>
        <p className="text-lg font-light text-white mt-5 text-center">
            Ingresa tu correo y contraseña, y <span className="text-fuchsia-500 font-bold"> comienza a planear tus proyectos</span>
        </p>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-8 p-6 mt-7 bg-white rounded-lg" noValidate>
            <div className="flex flex-col gap-5">
                <label className="font-normal text-lg" htmlFor="email">Correo</label>

                <input id="email" type="email" placeholder="Correo de Registro" className="w-full p-3 border-gray-300 border"
                    {...register("email", {
                        required: "El correo es obligatorio",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Correo no válido"
                        }
                    })}
                />
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </div>

            <div className="flex flex-col gap-5">
                <label className="font-normal text-lg">Contraseña</label>

                <input type="password" placeholder="Password de Registro" className="w-full p-3 border-gray-300 border"
                    {...register("password", {
                        required: "El Password es obligatorio"
                    })}
                />
                {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </div>

            <input type="submit" value="Iniciar Sesión" className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-lg cursor-pointer"/>
        </form>

        <nav className="mt-10 flex flex-col space-y-2">
            <Link to={'/auth/register'} className="text-center text-gray-300 hover:text-fuchsia-500 hover:font-bold">
                ¿No tienes cuenta?, crea una
            </Link>

            <Link to={'/auth/forgot-password'} className="text-center text-gray-300 hover:text-fuchsia-500 hover:font-bold">
                Olvidé mi contraseña
            </Link>
        </nav>
        </>
    )
}
