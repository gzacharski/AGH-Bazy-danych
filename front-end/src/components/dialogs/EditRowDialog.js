import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import React from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

export default function EditRowDialog(props) {

    const classes = useStyles();
    const { row, onClose, open } = props;

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Edit</DialogTitle>
            <Divider />
            <DialogContent>
                <form className={classes.root}>
                    {row.cells.map(cell => {
                        return (
                            <TextField
                                label={cell.column.Header}
                                variant="outlined"
                                defaultValue={cell.value}
                            />
                        );
                    })}
                </form>
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
