import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Divider from '@material-ui/core/Divider';

export default function ConfigDialog(props) {

    const {allColumns, onClose, open }=props;

    return (
        <Dialog
            aria-labelledby="dialog-add-entity"
            onClose={onClose}
            open={open}
        >
            <DialogTitle>Select colums to show</DialogTitle>
            <Divider/>
            <DialogContent>
                    {
                        allColumns.map(column => (
                            <div key={column.id}>
                                <label>
                                    <input type='checkbox' {...column.getToggleHiddenProps()} />
                                    <span>{column.Header}</span>
                                </label>
                            </div>
                        ))
                    }
            </DialogContent>
            <DialogActions>
                <button className="btn btn-light" onClick={onClose}>
                    Ok
                </button>
            </DialogActions>
        </Dialog>
    )
}