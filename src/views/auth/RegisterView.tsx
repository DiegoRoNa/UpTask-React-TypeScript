import { useForm } from "react-hook-form"
import { UserRegistrationForm } from "@/types/index"
import ErrorMessage from "@/components/ErrorMessage"
import { Link } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { createAccount } from "@/api/AuthAPI"
import { toast } from "react-toastify"

export default function RegisterView() {
    const initialValues: UserRegistrationForm = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    }

    const {register, handleSubmit, watch, reset, formState: { errors }} = useForm<UserRegistrationForm>({ defaultValues: initialValues })

    // watch, trabaja junto con validate, toma el campo principal y validate trabaja en el campo de comparacion
    const password = watch('password')

    const {mutate} = useMutation({
        mutationFn: createAccount,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
        }
    })

    const handleRegister = (formData: UserRegistrationForm) => mutate(formData)

    return (
        <>
        <h1 className="text-4xl font-black text-white text-center">Crear Cuenta</h1>
        <p className="text-xl font-light text-white mt-5 text-center">
            Llena el formulario para <span className="text-fuchsia-500 font-bold"> crear tu cuenta</span>
        </p>

        <form onSubmit={handleSubmit(handleRegister)} className="space-y-8 p-6 bg-white mt-7 rounded-lg" noValidate>
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

            <div className="flex flex-col gap-5">
                <label className="font-normal text-lg">Nombre</label>
                <input type="name" placeholder="Nombre de Registro" className="w-full p-3 border-gray-300 border"
                    {...register("name", {
                        required: "El Nombre de usuario es obligatorio"
                    })}
                />
                {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            </div>

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

            <input type="submit" value="Registrarme" className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-lg cursor-pointer"/>
        </form>

        <nav className="mt-10 flex flex-col space-y-2">
            <Link to={'/auth/login'} className="text-center text-gray-300 hover:text-fuchsia-500 hover:font-bold">
                ¿Ya tienes cuenta?, inicia sesión
            </Link>

            <Link to={'/auth/forgot-password'} className="text-center text-gray-300 hover:text-fuchsia-500 hover:font-bold">
                Olvidé mi contraseña
            </Link>
        </nav>
        </>
    )
}
