import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type initilStateProps = {
    folders: ({
        _count: {
            videos: number
        }
    } & {
        id: string
        name: string
        createdAt: Date
        workspaceId: string | null
    })[]
}

const initialState: initilStateProps = {
    folders: []
}

export const Folders = createSlice({
    name: 'folders',
    initialState,
    reducers:{
        FOLDERS: (state, action:PayloadAction<initilStateProps>) => {
            return {...action.payload}
        }
    }
})

export const { FOLDERS } = Folders.actions
export default Folders.reducer