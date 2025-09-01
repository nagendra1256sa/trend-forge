import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

interface AlertDialogProps {
    isOpen: boolean;
    onClose: (isAgree: boolean) => void;
    title: string;
    message: string;
}

export function CommonAlertDialog({ isOpen, onClose, title, message }: AlertDialogProps): React.JSX.Element {

    const handleClose = (isAgree: boolean) => {
        onClose(isAgree);
    };

    return <>
        <Dialog
            open={isOpen}
            onClose={() => handleClose(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>

            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => handleClose(true)}>Yes</Button>
                <Button onClick={() => handleClose(false)}>No</Button>
            </DialogActions>

        </Dialog>
    </>;
}

