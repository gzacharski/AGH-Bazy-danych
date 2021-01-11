import axios from 'axios';

import {
    Backdrop,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Snackbar,
    TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';
import {url} from '../../../config/config';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

const initCategory={
    name : '',
    description: ''
}

export default function AddCategoryDialog(props) {

    const classes = useStyles();

    const { onClose, open,create } = props;

    const [category, setCategory]=useState(initCategory);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [responseSuccess,setResponseSuccess]=useState(false);

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };
    const handleToggleBackdrop = () => {
        setOpenBackdrop(!openBackdrop);
    };

    const handleChange = property => ({ target: { value } }) => {
        setCategory({ ...category, [property]: value })
    }

    const handleClickSnackbar = () => {
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const addCategory = () => {
        setResponseSuccess(false);
        handleToggleBackdrop();
        onClose();
        axios
            .post(`${url}/api/categories`, category)
            .then(response => {
                setResponseSuccess(true);
                setCategory(initCategory);
                handleCloseBackdrop();
                handleClickSnackbar();
                create(response.data);
            })
            .catch(error => {
                setResponseSuccess(false);
                handleCloseBackdrop();
                handleClickSnackbar();
                console.log(error);
            })
    }

    return (
        <>
            {openBackdrop
                ?
                <Backdrop className={classes.backdrop} open={openBackdrop}>
                    <CircularProgress color="primary" />
                </Backdrop>
                :
                <Dialog
                    aria-labelledby="dialog-add-entity"
                    onClose={onClose}
                    open={open}
                >
                    <DialogTitle>Add new category</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <TextField
                            autoFocus
                            fullWidth
                            id="category-name"
                            label="Name"
                            margin="dense"
                            required
                            type="text"
                            value={category.name}
                            onChange={handleChange('name')}
                        />
                        <TextField
                            fullWidth
                            id="category-description"
                            label="Description"
                            margin="dense"
                            required
                            type="text"
                            value={category.description}
                            onChange={handleChange('description')}
                        />
                    </DialogContent>
                    <DialogActions>
                        <button className="btn btn-light" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="btn btn-light" onClick={addCategory}>
                            Add
                        </button>
                    </DialogActions>
                </Dialog>
            }
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                {responseSuccess ?
                    <Alert onClose={handleCloseSnackbar} severity="success">
                        New row has been added to database.
                    </Alert>
                    :
                    <Alert onClose={handleCloseSnackbar} severity="error">
                        Couldn't add the row to database.
                    </Alert>
                }
            </Snackbar>
        </>
    )
}