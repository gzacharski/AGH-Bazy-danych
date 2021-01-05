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

const initCustomer = {
    name: '',
    title: '',
    company: '',
    city: '',
    address: '',
    country: '',
    phone: '',
    postalCode: '',
    fax: ''
}

export default function AddDialog(props) {

    const classes = useStyles();

    const { onClose, open } = props;

    const [customer, setCustomer] = useState(initCustomer);
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
        setCustomer({ ...customer, [property]: value })
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

    const addCustomer = () => {
        setResponseSuccess(false);
        handleToggleBackdrop();
        onClose();
        axios
            .post('http://localhost:3000/api/customers', customer)
            .then(response => {
                setResponseSuccess(true);
                handleCloseBackdrop();
                handleClickSnackbar();
                console.log(response);
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
                    <DialogTitle>Add new customer</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <TextField
                            autoFocus
                            fullWidth
                            id="customer-name"
                            label="Name and surname"
                            margin="dense"
                            required
                            type="text"
                            value={customer.name}
                            onChange={handleChange('name')}
                        />
                        <TextField
                            fullWidth
                            id="customer-title"
                            label="Title"
                            margin="dense"
                            required
                            type="text"
                            value={customer.title}
                            onChange={handleChange('title')}
                        />
                        <TextField
                            fullWidth
                            id="customer-company"
                            label="Company"
                            margin="dense"
                            required
                            type="text"
                            value={customer.company}
                            onChange={handleChange('company')}
                        />
                        <TextField
                            fullWidth
                            id="customer-city"
                            label="City"
                            margin="dense"
                            required
                            type="text"
                            value={customer.city}
                            onChange={handleChange('city')}
                        />
                        <TextField
                            fullWidth
                            id="customer-address"
                            label="Address"
                            margin="dense"
                            required
                            type="text"
                            value={customer.address}
                            onChange={handleChange('address')}
                        />
                        <TextField
                            fullWidth
                            id="customer-country"
                            label="Country"
                            margin="dense"
                            required
                            type="text"
                            value={customer.country}
                            onChange={handleChange('country')}
                        />
                        <TextField
                            fullWidth
                            id="customer-phone"
                            label="Phone"
                            margin="dense"
                            required
                            type="text"
                            value={customer.phone}
                            onChange={handleChange('phone')}
                        />
                        <TextField
                            fullWidth
                            id="customer-postalCode"
                            label="Postal code"
                            margin="dense"
                            required
                            type="text"
                            value={customer.postalCode}
                            onChange={handleChange('postalCode')}
                        />
                        <TextField
                            fullWidth
                            id="customer-fax"
                            label="Fax"
                            margin="dense"
                            required
                            type="text"
                            value={customer.fax}
                            onChange={handleChange('fax')}
                        />
                    </DialogContent>
                    <DialogActions>
                        <button className="btn btn-light">
                            Cancel
                        </button>
                        <button className="btn btn-light" onClick={addCustomer}>
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