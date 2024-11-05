import { z } from "zod"

// Schema global Auth
export const authSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string()
})

// Schema Usuario autenticado
export const userSchema = authSchema.pick({
    name: true,
    email: true
}).extend({
    id: z.number() // agregar el id del usuario autenticado
})

// Schema del formulario de notas
export const noteSchema = z.object({
    id: z.number(),
    content: z.string(),
    createdBy: z.number(),
    taskId: z.number(),
    user: userSchema,
    createdAt: z.string()
})


// Schema de los status de un task
export const taskStatusSchema = z.enum(['pending', 'onHold', 'inProgress', 'underReview', 'completed'])

// Schema del task
export const taskSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    projectId: z.number(),
    status: taskStatusSchema,
    historyStatus: z.array(z.object({
        id: z.number(),
        user: userSchema,
        status: taskStatusSchema
    })),
    notes: z.array(noteSchema.extend({
        user: userSchema
    })),
    createdAt: z.string(), 
    updatedAt: z.string()
})

// Schema de una tarea de un proyecto
export const taskProjectSchema = taskSchema.pick({
    id: true,
    name: true,
    description: true,
    status: true
})


// Schema del project
export const projectSchema = z.object({
    id: z.number(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.number(userSchema.pick({id: true})),
    tasks: z.array(taskProjectSchema),
    team: z.array(userSchema.pick({id: true}))
})

// Schema para el array de projects
export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        id: true,
        projectName: true,
        clientName: true,
        description: true,
        manager: true
    })
)

// Schema para editar un proyecto
export const editProjectSchema = projectSchema.pick({
    projectName: true,
    clientName: true,
    description: true
})

// Schema Usuario colaborador
export const teamMemberSchema = userSchema.pick({
    id: true,
    name: true,
    email: true
})

// Schema del array de colaboradores de un proyecto
export const teamMembersSchema = z.array(teamMemberSchema)

// type de Auth
export type Auth = z.infer<typeof authSchema>

// type de Auth login form
export type UserLoginForm = Pick<Auth, 'email' | 'password'> // solo requerimos estos campos para el login

// type de Auth Registro form
export type UserRegistrationForm = Pick<Auth, 'name' | 'email' | 'password' | 'password_confirmation'>

// type de Auth request new code
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>

// type de Auth olvide pass form
export type ForgotPasswordForm = Pick<Auth, 'email'>

// type de Auth olvide pass form
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>

// type de Auth cambiar pass form
export type UpdateCurrentUserPasswordForm = Pick<Auth, 'current_password' | 'password' | 'password_confirmation'>

// type del token
export type ConfirmToken = Pick<Auth, 'token'>

// type del form validar password
export type CheckPasswordForm = Pick<Auth, 'password'>

// type del project
export type Project = z.infer<typeof projectSchema>

// type del array de projects
export type DashboardProjects = z.infer<typeof dashboardProjectSchema>

// type del formulario de proyectos
export type ProjectFormData = Pick<Project, 'clientName' | 'projectName' | 'description'>

// type del note
export type Note = z.infer<typeof noteSchema>

// type del form de la note
export type NoteFormData = Pick<Note, 'content'>

// type del task
export type Task = z.infer<typeof taskSchema>

// type del formulario de tareas
export type TaskFormData = Pick<Task, 'name' | 'description'>

// type del task de un project
export type TaskProject = z.infer<typeof taskProjectSchema>

// type del status de la tarea
export type TaskStatus = z.infer<typeof taskStatusSchema>

// type del usuario autenticado
export type User = z.infer<typeof userSchema>

// type del formulario para editar usuario
export type UserProfileForm = Pick<User, 'name' | 'email'>

// type del usuario colaborador
export type TeamMember = z.infer<typeof teamMemberSchema>

// type par el form de nuevo colaborador
export type TeamMemberForm = Pick<TeamMember, 'email'>
