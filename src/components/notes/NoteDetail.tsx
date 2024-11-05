import { deleteNote } from "@/api/NoteAPI"
import { useAuth } from "@/hooks/useAuth"
import { Note } from "@/types/index"
import { formatDate } from "@/utils/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type NoteDetailProps = {
    note: Note
}

export default function NoteDetail({note} : NoteDetailProps) {

    // obtener el usuario autenticado
    const {data, isLoading} = useAuth()
    const canDelete = useMemo(() => data?.id === note.user.id, [data])

    // obtener proyecto
    const params = useParams()
    const projectId = Number(params.projectId)

    // obtener tarea
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = Number(queryParams.get('viewTask'))

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]}) // tarea actualizada
        }
    })

    if (isLoading) return 'Cargando...'

    return (
        <div className="p-3 flex justify-between items-center">
            <div>
                <p>{note.content} por: <span className="font-bold">{note.user.name}</span></p>
                <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
            </div>

            {canDelete && (
                <button type="button" onClick={() => mutate({projectId, taskId, noteId: note.id})} className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors">Eliminar</button>
            )}

        </div>
    )
}
