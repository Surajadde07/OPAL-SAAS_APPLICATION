'use client'

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import FolderReducer from './slices/folders'
import WorkSpacesReducer from './slices/workspaces'

const rootReducer = combineReducers({
    FolderReducer,
    WorkSpacesReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware:(getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector