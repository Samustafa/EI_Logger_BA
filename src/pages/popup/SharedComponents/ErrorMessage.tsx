import {errorDivStyle} from "@pages/popup/Consts/Styles";
import React from "react";

export function ErrorMessage({error}: { error: string | null }) {
    return (
        <>
            {error && <div className={errorDivStyle} data-testid="error_text">{error}</div>}
        </>
    );
}