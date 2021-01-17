import React, {useEffect, useState} from 'react'
import axios from "axios";
import {url} from "../../../config/config";
import {makeStyles} from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import {
    Backdrop,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider, FormControl, InputLabel, MenuItem, Select, Snackbar,
    TextField
} from "@material-ui/core";

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

const initOrder = {
    //customerId: '',
    //productId: 0,
    requiredDate : '',
    shippedDate : '',
    freight : 0,
    shipName : '',
    shipAddress : '',
    shipCity : '',
    shipPostalCode : '',
    shipCountry : '',
    unitPrice : 0,
    quantity : 0,
    discount : 0
}

export default function AddOrderDialog(props) {

    const classes = useStyles();

    const { onClose, open ,create} = props;

    const [order,setOrder] = useState(initOrder);
    const [customer, setCustomer] = useState('');
    const [customers, setCustomers] = useState(null);
    const [product, setProduct] = useState('');
    const [products, setProducts] = useState(null);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [responseSuccess,setResponseSuccess]=useState(false);

    useEffect(loadCustomers, []);

    function loadCustomers() {
        axios.get(`${url}/api/customers`)
            .then(response => {
                console.log("Loading customers...");
                console.log(response);
                setCustomers(response.data.nodes);
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(loadProducts, []);

    function loadProducts() {
        axios.get(`${url}/api/products`)
            .then(response => {
                console.log("Loading products...");
                console.log(response);
                setProducts(response.data.nodes);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };
    const handleToggleBackdrop = () => {
        setOpenBackdrop(!openBackdrop);
    };

    const handleChange = property => ({ target: { value } }) => {
        setOrder({ ...order, [property]: value })
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

    const handleCustomerChange = (event) => {
        setCustomer(event.target.value);
    };

    const handleProductChange = (event) => {
        console.log(event.target.value);
        setProduct(event.target.value);
    }

    const addOrder = () => {
        console.log("Adding order...");

        setResponseSuccess(false);
        handleToggleBackdrop();
        onClose();
        axios
            .post(`${url}/api/orders`, {
                "customerId" : customer.id,
                "productId" : product.id.low,
                "requiredDate" : order.requiredDate,
                "shippedDate" : order.shippedDate,
                "freight" : order.freight,
                "shipName" : order.shipName,
                "shipAddress" : order.shipAddress,
                "shipCity" : order.shipCity,
                "shipPostalCode" : order.shipPostalCode,
                "shipCountry" : order.shipCountry,
                "unitPrice" : order.unitPrice,
                "quantity" : order.quantity,
                "discount" : order.discount
            })
            .then(response => {
                setResponseSuccess(true);
                setOrder(initOrder);
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

    const convertCustomerToSelectItems = () => {

        const customerSelectItems = customers.map(customer => (
            <MenuItem key={customer.id} value={customer}>
                {customer.id}
            </MenuItem>
        ));

        return (
            <FormControl fullWidth>
                <InputLabel id="customer-select-label">Customer</InputLabel>
                <Select
                    labelId="customer-select-label"
                    id="customer-select"
                    value={customer}
                    onChange={handleCustomerChange}
                >
                    {customerSelectItems}
                </Select>
            </FormControl>
        );
    }

    const convertProductToSelectItems = () => {

        const productSelectItems = products.map(product => (
            <MenuItem key={product.id} value={product}>
                {product.name}
            </MenuItem>
        ));

        return (
            <FormControl fullWidth>
                <InputLabel id="product-select-label">Product</InputLabel>
                <Select
                    labelId="product-select-label"
                    id="product-select"
                    value={product}
                    onChange={handleProductChange}
                >
                    {productSelectItems}
                </Select>
            </FormControl>
        );
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
                        {customers !== null ? convertCustomerToSelectItems() : null}
                        {products !== null ? convertProductToSelectItems() : null}
                        <TextField
                            autoFocus
                            fullWidth
                            id="required-date"
                            label="Required Date"
                            margin="dense"
                            required
                            type="text"
                            value={order.requiredDate}
                            onChange={handleChange('requiredDate')}
                        />
                        <TextField
                            fullWidth
                            id="shipped-date"
                            label="Shipped Date"
                            margin="dense"
                            required
                            type="text"
                            value={order.shippedDate}
                            onChange={handleChange('shippedDate')}
                        />
                        <TextField
                            fullWidth
                            id="freight"
                            label="Freight"
                            margin="dense"
                            required
                            type="number"
                            value={order.freight}
                            onChange={handleChange('freight')}
                        />
                        <TextField
                            fullWidth
                            id="ship-name"
                            label="Ship Name"
                            margin="dense"
                            required
                            type="text"
                            value={order.shipName}
                            onChange={handleChange('shipName')}
                        />
                        <TextField
                            fullWidth
                            id="ship-address"
                            label="Ship Address"
                            margin="dense"
                            required
                            type="text"
                            value={order.shipAddress}
                            onChange={handleChange('shipAddress')}
                        />
                        <TextField
                            fullWidth
                            id="ship-city"
                            label="Ship City"
                            margin="dense"
                            required
                            type="text"
                            value={order.shipCity}
                            onChange={handleChange('shipCity')}
                        />
                        <TextField
                            fullWidth
                            id="ship-postal-code"
                            label="Ship Postal Code"
                            margin="dense"
                            required
                            type="text"
                            value={order.shipPostalCode}
                            onChange={handleChange('shipPostalCode')}
                        />
                        <TextField
                            fullWidth
                            id="ship-country"
                            label="Ship Country"
                            margin="dense"
                            required
                            type="text"
                            value={order.shipCountry}
                            onChange={handleChange('shipCountry')}
                        />
                        <TextField
                            fullWidth
                            id="unit-price"
                            label="Unit Price"
                            margin="dense"
                            required
                            type="number"
                            value={order.unitPrice}
                            onChange={handleChange('unitPrice')}
                        />
                        <TextField
                            fullWidth
                            id="quantity"
                            label="Quantity"
                            margin="dense"
                            required
                            type="number"
                            value={order.quantity}
                            onChange={handleChange('quantity')}
                        />
                        <TextField
                            fullWidth
                            id="discount"
                            label="Discount"
                            margin="dense"
                            required
                            type="number"
                            value={order.discount}
                            onChange={handleChange('discount')}
                        />
                    </DialogContent>
                    <DialogActions>
                        <button className="btn btn-light" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="btn btn-light" onClick={addOrder}>
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
