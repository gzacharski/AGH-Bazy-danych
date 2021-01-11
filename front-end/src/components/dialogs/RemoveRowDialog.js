import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider
} from "@material-ui/core";
import React from "react";

export default function RemoveRowDialog(props) {
    const { row, onClose, open, deleteRow } = props;

    const handleRemove = () => {
        deleteRow(row);
        onClose();
    }

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Remove</DialogTitle>
            <Divider />
            <DialogContent>
                <h5>Are you sure you want to remove the row from database?</h5>
                The row will be deleted immediately. You can't undo this action.
            </DialogContent>
            <DialogActions>
                <button className="btn btn-light" onClick={onClose}>
                    Cancel
                </button>
                <button className="btn btn-light" onClick={handleRemove}>
                    Remove
                </button>
            </DialogActions>
        </Dialog>
    );
}
