import {Snackbar, SnackbarContent} from "@mui/material";
import * as React from "react";

type NotificationType = "error" | "success";


interface Props {
    notificationType: NotificationType;
    message: string;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function Notification({notificationType, message, open, setOpen}: Props) {
    const color = notificationType === "error" ? "red" : "green";

    return (
        <Snackbar
            anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            autoHideDuration={2000}
            onClose={() => setOpen(false)}
            open={open}
        >
            <SnackbarContent
                style={{backgroundColor: color}}
                message={message}
            />
        </Snackbar>
    );
}