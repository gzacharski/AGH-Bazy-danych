import {
    Backdrop,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import React, {useState} from "react";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function RemoveRowDialog(props) {
    const classes = useStyles();
    const { row, onClose, open, deleteRow } = props;

    const [openBackdrop, setOpenBackdrop] = useState(false);

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };
    const handleToggleBackdrop = () => {
        setOpenBackdrop(!openBackdrop);
    };

    const handleRemove = () => {
        console.log("RemoveDialog");

        handleToggleBackdrop();
        onClose();

        deleteRow(row)
            .then(response=>{
                console.log(response);
                handleCloseBackdrop();
            })
            .catch(error=>{
                handleCloseBackdrop();
                console.log(error);
            })
    }

    return (
        <>
            {
                openBackdrop
                ?
                <Backdrop className={classes.backdrop} open={openBackdrop}>
                    <CircularProgress color="primary" />
                </Backdrop>
                :
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
            }
        </>
    );
}
