import { deleteTask } from "@/api/TaskAPI"
import { TaskProject } from "@/types/index"
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Fragment } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useDraggable } from "@dnd-kit/core"

type TaskCardProps = {
    task: TaskProject
    canEdit: boolean
}

export default function TaskCard({task, canEdit} : TaskCardProps) {

    // libreria para arrastrar elementos
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id })

    const location = useLocation()

    const navigate = useNavigate()

    // obtener proyecto
    const params = useParams()
    const projectId = Number(params.projectId)

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: deleteTask,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
          
            toast.success(data)

            // habilitar los querys, para que consulte de nuevo la info
            // con esto se mantiene el state actulizado
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
        }
    })

    // translate3d: es una propieda de css
    // x: px de izquierda a derecha
    // y: de abajo a arriba
    // 0: el fondo
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        padding: '1.25rem',
        backgroundColor: '#FFF',
        width: '300px',
        display: 'flex',
        borderWidth: '1px',
        borderColor: 'rgb(203 213 225 / var(--tw-border-opacity))'
    } : undefined

    return (
        <li className="p-4 bg-white border border-slate-300 flex justify-between gap-3">
            <div 
            {...listeners /**Eventos presionar y arrastrar */}
            {...attributes /**Atributos */}
            ref={setNodeRef /**Elemento que tendrá el drop */}
            style={style /**estilos de draggable */}
            className="min-w-0 flex flex-col gap-y-4">
                <p className="font-bold text-slate-600 text-left">{task.name}</p>
                <p className="text-slate-500">{task.description}</p>
            </div>

            <div className="flex shrink-0  gap-x-6">
                <Menu as="div" className="relative flex-none">
                    <MenuButton className="-m-2.5 block p-1.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">opciones</span>
                        <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
                    </MenuButton>

                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        
                        <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <MenuItem>
                                <button type='button' onClick={() => navigate(`${location.pathname}?viewTask=${task.id}`)} className='block px-3 py-1 text-sm leading-6 text-gray-800 hover:text-black'>
                                    Ver Tarea
                                </button>
                            </MenuItem>
                            
                            {canEdit && (
                                <>
                                <MenuItem>
                                    <button type='button' onClick={() => navigate(`${location.pathname}?editTask=${task.id}`)} className='block px-3 py-1 text-sm leading-6 text-gray-800 hover:text-black'>
                                        Editar Tarea
                                    </button>
                                </MenuItem>

                                <MenuItem>
                                    <button type='button' onClick={() => mutate({projectId, taskId: task.id})} className='block px-3 py-1 text-sm leading-6 text-red-500 hover:text-red-600'>
                                        Eliminar Tarea
                                    </button>
                                </MenuItem>
                                </>
                            )}
                            
                        </MenuItems>

                    </Transition>
                </Menu>
            </div>
        </li>
    )
}
