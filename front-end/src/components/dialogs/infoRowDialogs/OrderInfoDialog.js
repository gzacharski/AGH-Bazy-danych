import axios from 'axios';
import {
    CircularProgress,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Paper,
    TextField
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import React,  { useState, useEffect }  from "react";
import { url } from '../../../config/config';
import ProductOrderDetailsDialogDisabled from './ProductOrderDetailsDialogDisabled';
 
const useStyles = makeStyles((theme) => ({
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

export default function ProductInfoDialog(props) {

    const classes = useStyles();
    const { row, onClose, open} = props;

    const [customer,setCustomer]=useState(null);
    const [products,setProducts]=useState(null);
    const [productDetails,setProductDetails]=useState(null);
    const [openChipDialog,setOpenChipDialog]=useState(false);

    const orderID=row.cells.filter(cell=>cell.column.Header==="Id")[0].value;

    const loadOrderByID=()=>{
        console.log(`Entering...${orderID}`);
        axios.get(`${url}/api/orders/${orderID}/customer/orderdetails`)
            .then(response => {
                console.log("Loading product details...");
                console.log(response);

                setCustomer(response.data.customerId[0]);
                console.log(response.data.customerId[0]);
                setProducts(response.data.orderDetailsResult);
                console.log(response.data.orderDetailsResult);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleCloseChipDialog=()=>{
        setOpenChipDialog(false);
        setProductDetails(null);
    }

    const openProductDetailsDialog=(product)=>{
        setProductDetails(product);
        setOpenChipDialog(true);
        console.log(`Chiped cliked ${product.product.name}`);
    }


    const showProducts=()=>{
        const temProducts=products.map(product =>
            <li key={product.product.id}>
                <Chip 
                    label={product.product.name} 
                    className={classes.chip}
                    onClick={()=>openProductDetailsDialog(product)}
                />
            </li>
        );
        
        return (
            <Paper component="ul" className={classes.paper}>
                {temProducts}
                {productDetails!==null?
                    <ProductOrderDetailsDialogDisabled
                        onClose={handleCloseChipDialog}
                        open={openChipDialog}
                        product={productDetails}
                    />
                    :null
                }
            </Paper>
        )
    };

    return (
        <Dialog
            onClose={onClose}
            open={open}
            onEntered={loadOrderByID}
        >
            <DialogTitle>More info about Order</DialogTitle>
            <Divider />
            <DialogContent>
                <form className={classes.root}>
                    {
                        customer==null
                        ?<CircularProgress color="primary" />
                        :<TextField
                            fullWidth
                            label={"Customer"}
                            InputProps={{
                                readOnly: true,
                            }}
                            disabled
                            variant="outlined"
                            defaultValue={customer.name}
                        />
                    }
                    {
                        products==null
                        ?<CircularProgress color="primary" />
                        :showProducts()
                    }
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
