import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';


export default function AddCustomer(props) {

    const { onClose, open } = props;

    return (
        <Dialog
            aria-labelledby="dialog-add-entity"
            onClose={onClose}
            open={open}
        >
            <DialogTitle>Add new customer</DialogTitle>
            <DialogContent>
                <TextField
                    id="customer-name"
                    label="Name"
                />
            </DialogContent>
        </Dialog>
    )
}
