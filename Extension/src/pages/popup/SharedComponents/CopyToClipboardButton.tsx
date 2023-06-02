import React, {useState} from "react";
import {IconButton, Snackbar} from "@mui/material";
import {CopyIcon} from "@pages/popup/svg/CopyIcon";

interface Props {
    textToCopy: string;
}

const CopyToClipboardButton = ({textToCopy}: Props) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
        navigator.clipboard.writeText(textToCopy);
    };

    return (
        <>
            <IconButton onClick={handleClick} color="primary">
                <CopyIcon/>
            </IconButton>
            <Snackbar
                message="Copied to clibboard"
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                open={open}
            />
        </>
    );
};

export default CopyToClipboardButton;
