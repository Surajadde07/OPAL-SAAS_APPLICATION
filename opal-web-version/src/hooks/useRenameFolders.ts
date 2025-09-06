import { useRef } from 'react'

export const useRenameFolders = (folderId: string) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const folderCardRef = useRef<HTMLDivElement | null>(null)
  
  // TODO: Add folder rename functionality here
  
  return {
    inputRef,
    folderCardRef
  }
}
