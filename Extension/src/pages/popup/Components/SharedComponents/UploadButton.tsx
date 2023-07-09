import {buttonDisabledStyle, buttonStyle} from "@pages/popup/Constants/Styles";
import * as React from "react";

interface Props {
    isDisabled?: boolean
    onClick: () => void
}

export function UploadButton({isDisabled, onClick}: Props) {

    return (
        <button className={isDisabled ? buttonDisabledStyle : buttonStyle}
                disabled={isDisabled}
                onClick={() => onClick()}>

            Upload
        </button>
    )

}