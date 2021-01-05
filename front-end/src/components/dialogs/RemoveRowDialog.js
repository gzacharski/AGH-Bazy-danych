import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider
} from "@material-ui/core";
import React from "react";

export default function RemoveRowDialog(props) {
    const { row, onClose, open } = props;

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>remove</DialogTitle>
            <Divider />
            <DialogContent>
                "todo -> Remove data"
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
    );
}
