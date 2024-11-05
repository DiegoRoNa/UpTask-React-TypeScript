import ProjectForm from "@/components/projects/ProjectForm"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { ProjectFormData } from "@/types/index"
import { createProject } from "@/api/ProjectAPI"
import { toast } from "react-toastify"
import { useMutation } from "@tanstack/react-query"

export default function CreateProjectView() {

    // hook de redireccion
    const navigate = useNavigate()

    // igual que lo que se debe mandar al backend
    const initialValues : ProjectFormData = {
        projectName: '',
        clientName: '',
        description: ''
    }

    const {register, handleSubmit, formState: {errors}} = useForm({ defaultValues: initialValues })

    // React Query
    const { mutate } = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.error(error.message) // message, contiene el error que se declara en la api
        },
        onSuccess: (response) => { // response, toma lo que retorne la api
            toast.success(response) // funcion para ejecutar la alerta de toastify
            navigate('/') // redireccionar
        }
    })

    // crear proyecto
    const handleForm = (formData : ProjectFormData) => mutate(formData) 

    return (
        <>
        <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-black">Crear Proyecto</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para crear un proyecto</p>

            <nav className="my-5">
                <Link to='/' className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors">
                    Volver a proyectos
                </Link>
            </nav>

            <form onSubmit={handleSubmit(handleForm)} noValidate className="mt-10 bg-white shadow-lg p-10 rounded-lg">
                <ProjectForm register={register} errors={errors}/>
                <input type="submit" value="Crear proyecto" className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors" />
            </form>
        </div>
        </>
    )
}
