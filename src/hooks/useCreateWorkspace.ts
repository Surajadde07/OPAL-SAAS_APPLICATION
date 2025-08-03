import { createWorkspace } from "@/app/actions/workspace"
import { useMutationData } from "./useMutationData"

export const useCreateWorkspace= () => {
    const {} = useMutationData(
        ['create-workspace'],
        (data: {name:string}) =>  createWorkspace(data.name),
        'user-workspaces'
    )
}

//? 04:31:54