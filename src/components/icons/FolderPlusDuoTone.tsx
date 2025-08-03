import React from 'react'

type Props = {
    size?: number
    className?: string
}

const FolderPlusDuoTone = ({ size = 24, className }: Props) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Folder back part with light opacity */}
            <path
                d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V9C2 8.46957 2.21071 7.96086 2.58579 7.58579C2.96086 7.21071 3.46957 7 4 7H9L11 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V19Z"
                fill="currentColor"
                fillOpacity="0.2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Folder tab with medium opacity */}
            <path
                d="M2 6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H9L11 6H2Z"
                fill="currentColor"
                fillOpacity="0.4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Plus icon with full opacity - modern circular background */}
            <circle
                cx="12"
                cy="15"
                r="4"
                fill="currentColor"
                fillOpacity="0.9"
            />

            {/* Plus symbol */}
            <path
                d="M12 13V17M10 15H14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Additional modern accent - subtle glow effect */}
            <circle
                cx="12"
                cy="15"
                r="4"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeOpacity="0.3"
            />
        </svg>
    )
}

export default FolderPlusDuoTone
