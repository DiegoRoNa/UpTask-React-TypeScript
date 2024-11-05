import { ChangeEvent, Fragment, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTaskById, updateStatus } from '@/api/TaskAPI'
import { toast } from 'react-toastify'
import { formatDate } from '@/utils/index'
import { statusTranslitions } from '@/locales/es'
import { TaskStatus } from '@/types/index'
import NotesPanel from '../notes/NotesPanel'

export default function TaskModalDetails() {
  
    const navigate = useNavigate()

    // obtener proyecto
    const params = useParams()
    const projectId = Number(params.projectId)

    // obtener querystring de la url para el modal
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = Number(queryParams.get('viewTask'))
    const show = taskId ? true : false

    const { data, isError, error } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({projectId, taskId}),
        enabled: !!taskId, // "!!", convierte un valor en boolean, si hay algo es true, si no es false
        retry: false
    })

    const queryClient = useQueryClient()

    // react query
    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            // habilitar los querys, para que consulte de nuevo la info
            // con esto se mantiene el state actulizado
            queryClient.invalidateQueries({queryKey: ['project', projectId]}) // proyecto actualizado
            queryClient.invalidateQueries({queryKey: ['task', taskId]}) // volver a abrir el modal, aparece la info actualizada

            toast.success(data)
            // navigate(location.pathname, {replace: true}) // ocultar modal
        }
    })

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value as TaskStatus
        const data = { projectId, taskId, status }
        mutate(data) // ejecutar funcion de actualizar
    }

    // si hay un error
    useEffect(() => {
        if(isError) {
            toast.error(error.message, {toastId: 'error'}) // error de la api, toastId, es una key para que salga una alerta solamente
            return navigate(`/projects/${projectId}`)
        }
    }, [isError])

    if (data) return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace: true})}>
                    <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0"
                        enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/60" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <p className='text-sm text-slate-400'>Agregada el: {formatDate(data.createdAt)}</p>
                                    
                                    <p className='text-sm text-slate-400'>Última actualización: {formatDate(data.updatedAt)}</p>
                                    
                                    <DialogTitle as="h3" className="font-black text-4xl text-gray-800 my-5">
                                        {data.name}
                                    </DialogTitle>
                                    
                                    <p className='text-lg text-slate-500 mb-2'><span className='text-fuchsia-500'>Descripción:</span> {data.description}</p>
                                    
                                    {data.historyStatus.length ? (
                                        <>
                                        <p className='text-lg text-fuchsia-500 mb-2'>Historial de cambios</p>
                                    
                                        <ul className='list-decimal'>
                                            {data.historyStatus.map( activityLog => (
                                                <li key={activityLog.id}>
                                                    <span className='font-bold text-slate-500'>
                                                        {statusTranslitions[activityLog.status]} por:
                                                    </span>
                                                    {' '+activityLog.user.name}
                                                </li>
                                            ))}
                                        </ul>
                                        </>
                                    ) : null}

                                    <div className='my-5 space-y-3'>
                                        <label className='font-bold'>Estado Actual:</label>
                                        <select defaultValue={data.status} onChange={handleChange} className='w-full p-3 bg-white border border-gray-300'>
                                            {Object.entries(statusTranslitions).map(([key, value]) => (
                                                <option value={key} key={key}>{value}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <NotesPanel notes={data.notes}/>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}