import axios from "axios";
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
import { makeStyles } from '@material-ui/core/styles';
import React, {useEffect, useState} from 'react';
import MuiAlert from "@material-ui/lab/Alert";
import {url} from "../../../config/config";
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
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
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

export default function EditRowDialog(props) {

    const classes = useStyles();
    const {onClose, open,updateRow} = props;
    const [row,setRow]=useState(props.row);

    const [order,setOrder] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [customers, setCustomers] = useState(null);
    const [product, setProduct] = useState('');
    const [products, setProducts] = useState(null);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [responseSuccess,setResponseSuccess]=useState(false);
    const [productsAddedToOrder,setProductsAddedToOrder]=useState([]);
    const [openChipDialog,setOpenChipDialog]=useState(false);

    const orderID=row.cells.filter(cell=>cell.column.Header==="Id")[0].value;

    const loadOrderByID=()=>{
        console.log(`Entering...${orderID}`);

        axios.get(`${url}/api/orders/${orderID}`)
            .then(response => {
                console.log("Loading product details...");
                console.log(response);
                setOrder(response.data);
            })
            .catch(error => {
                console.log(error);
            })

        axios.get(`${url}/api/orders/${orderID}/customer/orderdetails`)
            .then(response => {
                console.log("Loading product details...");
                console.log(response);

                setCustomer(response.data.customerId[0]);
                console.log(response.data.customerId[0]);
                setProductsAddedToOrder(response.data.orderDetailsResult);
                console.log(response.data.orderDetailsResult);
            })
            .catch(error => {
                console.log(error);
            })
    }
    
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
            product: event.target.value,
            unitPrice : 0,
            quantity : 0,
            discount :0
        }
        setProductsAddedToOrder([...productsAddedToOrder,tempProduct])
        console.log("Products in order");
        console.log(tempProduct);
    }

    const updateOrder = () => {
        console.log("Adding order...");

        const tempOrderDetails=productsAddedToOrder.map(product=>({
            productId: Number.parseInt(product.product.id),
            unitPrice: Number.parseInt(product.unitPrice),
            quantity : Number.parseInt(product.quantity),
            discount : Number.parseInt(product.discount)
        }));

        setResponseSuccess(false);
        handleToggleBackdrop();
        onClose();
        axios
            //.put(`${url}/api/orders/new`, {
            .put(`${url}/api/orders/new`, {
                orderProperties : order,
                customer : customer,
                orderDetails : tempOrderDetails,
            })
            .then(response => {
                console.log(response);
                
                if(response.status===201 || response.status===200){
                    setResponseSuccess(true);
                    setOrder(null);
                    setCustomer(null);
                    setProduct('');
                    setProductsAddedToOrder([]);
                    //updateRow(response.data.orderProperties);
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

    const getCustomerIndex=(id,customers)=>{
        for(let i=0; i<customers.length; i++){
            if(customers[i].id===id){
                return i;
            }
        }
        return "";
    }

    const convertCustomerToSelectItems = () => {

        const customerSelectItems = customers.map(customer => (
            <MenuItem key={customer.id} value={customer}>
                {customer.name}
            </MenuItem>
        ));


        return (
            <>
                <FormControl fullWidth>
                    <InputLabel id="customer-select-label">Customer</InputLabel>
                    <Select
                        labelId="customer-select-label"
                        id="customer-select"
                        value={customers[getCustomerIndex(customer.id,customers)]}
                        onChange={handleCustomerChange}
                    >
                        {customerSelectItems}
                    </Select>
                </FormControl>
            </>
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
        console.log(`removed ${removedProduct.product.name}`);
        const tempProductAddedToOrder=productsAddedToOrder
            .filter(product =>product.product.id!==removedProduct.product.id);
        setProductsAddedToOrder(tempProductAddedToOrder);
    }

    const [productDetails,setProductDetails]=useState(null);

    const openProductDetailsDialog=(product)=>{
        setProductDetails(product);
        setOpenChipDialog(true);
        console.log(`Chiped cliked ${product.product.name}`);
        console.log(product);
    }

    const updateProductsAddedToOrder=(updatedProduct)=>{
        console.log("Update product added to order");
        console.log(updatedProduct);
        console.log(productsAddedToOrder);

        setProductDetails(null);
        const tempProductsAddedToOrder=productsAddedToOrder
            .filter(product=>product.product.id!==updatedProduct.product.id);
        
        setProductsAddedToOrder(tempProductsAddedToOrder.concat(updatedProduct));
    }

    const handleCloseChipDialog=()=>{
        setOpenChipDialog(false);
        setProductDetails(null);
    }

    const showProducts=()=>{
        const temProducts=productsAddedToOrder.map(product =>
            <li key={product.product.id}>
                <Chip 
                    label={product.product.name} 
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

    const handleCancelUpdateOrder=()=>{
        setOrder(null);
        setCustomer(null);
        setProduct(null);
        setProductsAddedToOrder([]);
        onClose();
    }

    const showOrderInfo= () =>{

        return(
            <>
                <TextField
                    autoFocus
                    fullWidth
                    id="required-date"
                    label="Required Date"
                    margin="dense"
                    required
                    type="date"
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
            </>
        )
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
                    onEntered={loadOrderByID}
                >
                    <DialogTitle>Update order</DialogTitle>
                    <Divider />
                    <DialogContent>
                        {(customers !== null && customer !==null)? convertCustomerToSelectItems(): <CircularProgress color="primary" />}
                        {products !== null ? convertProductToSelectItems() : <CircularProgress color="primary" />}
                        {productsAddedToOrder.length!==0? showProducts():<CircularProgress color="primary" />}
                        {order!==null? showOrderInfo(): <CircularProgress color="primary" />}
                    </DialogContent>
                    <DialogActions>
                        <button className="btn btn-light" onClick={handleCancelUpdateOrder}>
                            Cancel
                        </button>
                        <button className="btn btn-light" onClick={updateOrder}>
                            Update
                        </button>
                    </DialogActions>
                </Dialog>
            }
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={responseSuccess ? "success" : "error"}>
                    {
                        responseSuccess
                            ?
                            <span>Order has been updated to database.</span>
                            :
                            <span>Couldn't update the order.</span>
                    }
                </Alert>
            </Snackbar>
        </>
    )
}
