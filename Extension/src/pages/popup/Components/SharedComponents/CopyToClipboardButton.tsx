import React, {useState} from "react";
import {IconButton} from "@mui/material";
import {CopyIcon} from "@pages/popup/Components/SharedComponents/SvgComponents/CopyIcon";
import {Notification} from "@pages/popup/Components/SharedComponents/Notification";

interface Props {
    textToCopy: string;
}

const CopyToClipboardButton = ({textToCopy}: Props) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
        navigator.clipboard.writeText(textToCopy).then().catch(error => console.log(error));
    };

    return (
        <>
            <IconButton onClick={handleClick} color="primary">
                <CopyIcon/>
            </IconButton>
            <Notification notificationType={'success'} message={"Copied to clipboard"} open={open} setOpen={setOpen}/>
        </>
    );
};

export default CopyToClipboardButton;
