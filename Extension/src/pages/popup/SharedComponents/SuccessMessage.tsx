import {successDivStyle} from "@pages/popup/Consts/Styles";
import React from "react";

interface Props {
    isSuccess: boolean;
}

export function SuccessMessage({isSuccess}: Props) {
    return (
        <>
            {isSuccess && <div className={successDivStyle} data-testid="error_text">Success</div>}
        </>
    );
}