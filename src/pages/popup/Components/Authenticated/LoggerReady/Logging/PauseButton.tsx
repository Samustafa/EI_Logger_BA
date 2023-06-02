import React from "react";

interface Props {
    onClick: () => void;
}


export const PauseButton: React.FC<Props> = ({onClick}) => (
    <button onClick={onClick}>
        <svg
            width="100px"
            height="100px"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            aria-hidden="true" role="img"
            className="iconify iconify--emojione"
            preserveAspectRatio="xMidYMid meet"
            fill="#000000">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <circle cx="32" cy="32" r="30" fill="#c43b3b"></circle>
                <g fill="#ffffff">
                    <path d="M20 14h8v36h-8z"></path>
                    <path d="M36 14h8v36h-8z"></path>
                </g>
            </g>
        </svg>
    </button>
)