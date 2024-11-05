import { Project, TeamMember } from "../types"

export const isManager = (managerId: Project['manager'], userId: TeamMember['id']) => managerId === userId