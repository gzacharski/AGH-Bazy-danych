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

export default function ProductInfoDialog(props) {

    const classes = useStyles();
    const { row, onClose, open} = props;

    return (
        <Dialog
            onClose={onClose}
            open={open}
        >
            <DialogTitle>More info about Product</DialogTitle>
            <Divider />
            <DialogContent>
                <form className={classes.root}>
                    {row.cells.map(cell => {
                        return (
                            <TextField
                                fullWidth
                                label={cell.column.Header}
                                InputProps={{
                                    readOnly: true,
                                }}
                                disabled
                                variant="outlined"
                                defaultValue={cell.value}
                            />
                        );
                    })}
                </form>
            </DialogContent>
            <DialogActions>
                <button className="btn btn-light" onClick={onClose}>
                    Ok
                </button>
            </DialogActions>
        </Dialog>
    )
}
