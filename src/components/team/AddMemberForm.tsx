import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "../ErrorMessage";
import { TeamMemberForm } from "@/types/index";
import { findUserByEmail } from "@/api/TeamAPI";
import SearchResult from "./SearchResult";

export default function AddMemberForm() {

    const initialValues: TeamMemberForm = {
        email: ''
    }

    const params = useParams()
    const projectId = Number(params.projectId)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

    // aqui usamos mutation completo, para poder obtener info
    const mutation = useMutation({
        mutationFn: findUserByEmail
    })

    const handleSearchUser = async (formData: TeamMemberForm) => {
        const data = {projectId, formData}
        mutation.mutate(data)
    }

    const resetData = () => {
        reset() // limpiar form
        mutation.reset() // reiniciar la mutacion
    }

    return (
        <>
            <form className="mt-10 space-y-5" onSubmit={handleSubmit(handleSearchUser)} noValidate>
                <div className="flex flex-col gap-3">
                    <label className="font-normal text-2xl" htmlFor="name">Correo del Usuario</label>
                    <input id="name" type="text" placeholder="Correo del usuario a Agregar" className="w-full p-3 border-gray-300 border"
                        {...register("email", {
                            required: "El correo es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Correo no válido",
                            }
                        })}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </div>

                <input type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer" value='Buscar Usuario'/>
            </form>
            
            <div className="mt-10">
                {mutation.isPending && <p className="text-center">Cargando...</p>}
                {mutation.error && <p className="text-center">{mutation.error.message}</p>}
                {mutation.data && <SearchResult user={mutation.data} reset={resetData}/>}
            </div>
        </>
    )
}