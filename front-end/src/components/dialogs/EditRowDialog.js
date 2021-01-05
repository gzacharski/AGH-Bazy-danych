import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider
} from "@material-ui/core";
import React from "react";

export default function EditRowDialog(props) {

    const { row, onClose, open } = props;

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Edit</DialogTitle>
            <Divider />
            <DialogContent>
                "todo -> Edit data"
            </DialogContent>
            <DialogActions>
                <button className="btn btn-light" onClick={onClose}>
                    Cancel
                </button>
                <button className="btn btn-light" onClick={onClose}>
                    Ok
                </button>
            </DialogActions>
        </Dialog>
    )
}
