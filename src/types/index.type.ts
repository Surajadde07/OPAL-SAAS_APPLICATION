export type WorkspaceProps = {
    data: {
        subscription: {
            plan: 'FREE' | 'PRO'
        } | null
        workspace: {
            id: string
            name: string
            type: 'PUBLIC' | 'PERSONAL'
        }[]
        members:{
            Workspace:{
                id: string
                name: string
                type: 'PUBLIC' | 'PERSONAL'
            }
        }[]
    }
}

export type NotificationsProps = {
    status: number,
    data:{
        _count:{
            notifications: number
        }
    }
}