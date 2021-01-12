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
import { url } from '../../../config/config'

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

const initSupplier = {
    companyName: '',
    contactName: '',
    contactTitle: '',
    phone: '',
    country: '',
    address: '',
    city: '',
    postalCode: ''
}

export default function AddSupplierDialog(props) {

    const classes = useStyles();

    const { onClose, open ,create} = props;

    const [supplier,setSupplier] = useState(initSupplier);
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
        setSupplier({ ...supplier, [property]: value })
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

    const addSupplier = () => {
        console.log(supplier);
        setResponseSuccess(false);
        handleToggleBackdrop();
        onClose();
        axios
            .post(`${url}/api/suppliers`, supplier)
            .then(response => {
                setResponseSuccess(true);
                setSupplier(initSupplier);
                handleCloseBackdrop();
                handleClickSnackbar();
                create(response.data);
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
            {
                openBackdrop
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
                    <DialogTitle>Add new supplier</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <TextField
                            autoFocus
                            fullWidth
                            id="supplier-company-name"
                            label="Company name"
                            margin="dense"
                            required
                            type="text"
                            value={supplier.companyName}
                            onChange={handleChange('companyName')}
                        />
                        <TextField
                            fullWidth
                            id="supplier-contact-name"
                            label="Contact name"
                            margin="dense"
                            required
                            type="text"
                            value={supplier.contactName}
                            onChange={handleChange('contactName')}
                        />
                        <TextField
                            fullWidth
                            id="supplier-contact-title"
                            label="Contact title"
                            margin="dense"
                            required
                            type="text"
                            value={supplier.contactTitle}
                            onChange={handleChange('contactTitle')}
                        />
                        <TextField
                            fullWidth
                            id="supplier-phone"
                            label="Phone"
                            margin="dense"
                            required
                            type="text"
                            value={supplier.phone}
                            onChange={handleChange('phone')}
                        />
                        <TextField
                            fullWidth
                            id="supplier-country"
                            label="Country"
                            margin="dense"
                            required
                            type="text"
                            value={supplier.country}
                            onChange={handleChange('country')}
                        />
                        <TextField
                            fullWidth
                            id="supplier-address"
                            label="Address"
                            margin="dense"
                            required
                            type="text"
                            value={supplier.address}
                            onChange={handleChange('address')}
                        />
                        <TextField
                            fullWidth
                            id="supplier-city"
                            label="City"
                            margin="dense"
                            required
                            type="text"
                            value={supplier.city}
                            onChange={handleChange('city')}
                        />
                        <TextField
                            fullWidth
                            id="supplier-postal-code"
                            label="Postal code"
                            margin="dense"
                            required
                            type="text"
                            value={supplier.postalCode}
                            onChange={handleChange('postalCode')}
                        />
                    </DialogContent>
                    <DialogActions>
                        <button className="btn btn-light" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="btn btn-light" onClick={addSupplier}>
                            Add
                        </button>
                    </DialogActions>
                </Dialog>
            }
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={responseSuccess ?"success":"error"}>
                    {
                        responseSuccess
                        ?
                        <span>New supplier has been added to database.</span>
                        :
                        <span>Couldn't add new supplier to database.</span>
                    }
                </Alert>
            </Snackbar>
        </>
    )
}
