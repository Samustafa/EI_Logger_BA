import React from "react";

interface PlayButtonProps {
    onClick: () => void;
}

export const PlayButton: React.FC<PlayButtonProps> = ({onClick}) => (
    <button onClick={onClick}>
        <svg width="100px"
             height="100px"
             viewBox="0 0 64 64"
             xmlns="http://www.w3.org/2000/svg"
             xmlnsXlink="http://www.w3.org/1999/xlink"
             aria-hidden="true"
             role="img"
             className="iconify iconify--emojione"
             preserveAspectRatio="xMidYMid meet">
            <circle cx="32" cy="32" r="30" fill="#4fd1d9"></circle>
            <path fill="#ffffff" d="M25 12l20 20l-20 20z"></path>
        </svg>
    </button>

)