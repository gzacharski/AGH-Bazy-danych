import React, {useEffect, useState} from 'react'
import axios from "axios";
import {url} from "../../../config/config";
import {makeStyles} from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import {
    Backdrop,
    CircularProgress,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider, 
    FormControl, 
    InputLabel, 
    MenuItem,
    Paper, 
    Select, 
    Snackbar,
    TextField
} from "@material-ui/core";
import ProductOrderDetailsDialog from './ProductOrderDetailsDialog';

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
    paper:{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
}));

const initOrder = {
    requiredDate : '',
    shippedDate : '',
    freight : 0,
    shipName : '',
    shipAddress : '',
    shipCity : '',
    shipPostalCode : '',
    shipCountry : '',
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
    const [productsAddedToOrder,setProductsAddedToOrder]=useState([]);
    const [openChipDialog,setOpenChipDialog]=useState(false);

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
        const tempProduct={
            data: event.target.value,
            details : {
                unitPrice : 0,
                quantity : 0,
                discount :0
            }
        }
        setProductsAddedToOrder([...productsAddedToOrder,tempProduct])
        console.log("Products in order");
        console.log(tempProduct);
    }

    const addOrder = () => {
        console.log("Adding order...");

        const tempOrderDetails=productsAddedToOrder.map(product=>({
            productId: Number.parseInt(product.data.id.low),
            unitPrice: Number.parseInt(product.details.unitPrice),
            quantity : Number.parseInt(product.details.quantity),
            discount : Number.parseInt(product.details.discount)
        }));

        setResponseSuccess(false);
        handleToggleBackdrop();
        onClose();
        axios
            .post(`${url}/api/orders`, {
                orderProperties : order,
                customer : customer,
                orderDetails : tempOrderDetails,
            })
            .then(response => {
                console.log(response);
                
                if(response.status===201 || response.status===200){
                    setResponseSuccess(true);
                    setOrder(initOrder);
                    setCustomer('');
                    setProduct('');
                    setProductsAddedToOrder([]);
                    create(response.data.orders);
                }else{
                    setResponseSuccess(false);
                }
                
                handleCloseBackdrop();
                handleClickSnackbar();
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
                {customer.name}
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
            <MenuItem key={product.id.low} value={product}>
                {product.name}
            </MenuItem>
        ));

        return (
            <FormControl fullWidth>
                <InputLabel id="product-select-label">Add product</InputLabel>
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

    const removeProductFromOrder=(removedProduct)=>{
        console.log(`removed ${removedProduct.data.name}`);
        const tempProductAddedToOrder=productsAddedToOrder
            .filter(product =>product.data.id.low!==removedProduct.data.id.low);
        setProductsAddedToOrder(tempProductAddedToOrder);
    }

    const [productDetails,setProductDetails]=useState(null);

    const openProductDetailsDialog=(product)=>{
        setProductDetails(product);
        setOpenChipDialog(true);
        console.log(`Chiped cliked ${product.data.name}`);
    }

    const updateProductsAddedToOrder=(updatedProduct)=>{
        setProductDetails(null);
        const tempProductsAddedToOrder=productsAddedToOrder
            .filter(product=>product.data.id.low!==updatedProduct.data.id.low);
        
        setProductsAddedToOrder(tempProductsAddedToOrder.concat(updatedProduct));
        console.log(productsAddedToOrder);
    }

    const handleCloseChipDialog=()=>{
        setOpenChipDialog(false);
        setProductDetails(null);
    }

    const showProducts=()=>{
        const temProducts=productsAddedToOrder.map(product =>
            <li key={product.data.id.low}>
                <Chip 
                    label={product.data.name} 
                    className={classes.chip}
                    onDelete={()=>removeProductFromOrder(product)}
                    onClick={()=>openProductDetailsDialog(product)}
                />
            </li>
        );
        
        return (
            <Paper component="ul" className={classes.paper}>
                {temProducts}
                {productDetails!==null?
                    <ProductOrderDetailsDialog
                        onClose={handleCloseChipDialog}
                        open={openChipDialog}
                        product={productDetails}
                        add={updateProductsAddedToOrder}
                    />
                    :null
                }
            </Paper>
        )
    };

    const handleCancelAddOrder=()=>{
        setOrder(initOrder);
        setCustomer('');
        setProduct('');
        setProductsAddedToOrder([]);
        onClose();
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
                    <DialogTitle>Create new order</DialogTitle>
                    <Divider />
                    <DialogContent>
                        {customers !== null ? convertCustomerToSelectItems() : null}
                        {products !== null ? convertProductToSelectItems() : null}
                        {productsAddedToOrder.length!==0? showProducts():null}
                        <TextField
                            autoFocus
                            fullWidth
                            id="required-date"
                            label="Required Date"
                            margin="dense"
                            required
                            type="date"
                            //defaultValue={new Date().toISOString().slice(0,10)}
                            value={order.requiredDate}
                            InputLabelProps={{
                                shrink: true,
                              }}
                            onChange={handleChange('requiredDate')}
                        />
                        <TextField
                            fullWidth
                            id="shipped-date"
                            label="Shipped Date"
                            margin="dense"
                            required
                            type="date"
                            value={order.shippedDate}
                            InputLabelProps={{
                                shrink: true,
                              }}
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
                    </DialogContent>
                    <DialogActions>
                        <button className="btn btn-light" onClick={handleCancelAddOrder}>
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
