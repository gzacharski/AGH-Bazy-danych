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
import { url } from '../../../config/config';

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

const initProduct = {
    name: '',
    quantityPerUnit: 0,
    unitPrice: 0,
    unitsInStock: 0,
    reorderLevel: 0,
    reorderLevel: 0,
    unitsOnOrder: 0,
    discontinued: 0
}

export default function AddProductDialog(props) {

    const classes = useStyles();
    const { onClose, open, create } = props;

    const [product, setProduct] = useState(initProduct);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [responseSuccess, setResponseSuccess] = useState(false);

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };
    const handleToggleBackdrop = () => {
        setOpenBackdrop(!openBackdrop);
    };

    const handleChange = property => ({ target: { value } }) => {
        setProduct({ ...product, [property]: value })
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

    const addProduct = () => {
        setResponseSuccess(false);
        handleToggleBackdrop();
        onClose();
        axios
            .post(`${url}/api/products`, product)
            .then(response => {
                setResponseSuccess(true);
                setCustomer(initProduct);
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
                    <DialogTitle>Add new product</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <TextField
                            autoFocus
                            fullWidth
                            id="product-name"
                            label="Name"
                            margin="dense"
                            required
                            type="text"
                            value={product.name}
                            onChange={handleChange('name')}
                        />
                        <TextField
                            fullWidth
                            id="product-quantity-per-unit"
                            label="Quantity per unit"
                            margin="dense"
                            required
                            type="number"
                            defaultValue={product.quantityPerUnit}
                            onChange={handleChange('quantityPerUnit')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            fullWidth
                            id="product-unit-price"
                            label="Unit price"
                            margin="dense"
                            required
                            type="number"
                            defaultValue={product.unitPrice}
                            onChange={handleChange('unitPrice')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            fullWidth
                            id="product-units-in-stock"
                            label="Units in stock"
                            margin="dense"
                            required
                            type="number"
                            defaultValue={product.unitsInStock}
                            onChange={handleChange('unitsInStock')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            fullWidth
                            id="product-reorder-level"
                            label="Reorder level"
                            margin="dense"
                            required
                            type="number"
                            defaultValue={product.reorderLevel}
                            onChange={handleChange('reorderLevel')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            fullWidth
                            id="product-units-on-order"
                            label="Units on order"
                            margin="dense"
                            required
                            type="number"
                            defaultValue={product.unitsOnOrder}
                            onChange={handleChange('unitsOnOrder')}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <button className="btn btn-light" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="btn btn-light" onClick={addProduct}>
                            Add
                        </button>
                    </DialogActions>
                </Dialog>
            }
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={responseSuccess ? "success" : "error"}>
                    {
                        responseSuccess
                            ?
                            <span>New row has been added to database.</span>
                            :
                            <span>Couldn't add the row to database.</span>
                    }
                </Alert>
            </Snackbar>
        </>
    )
}
