import axios from 'axios';
import {
    Backdrop,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    TextField
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import React,  { useState, useEffect }  from "react";
import { url } from '../../../config/config';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    container : {
        flexGrow: 1,
    }
}));

export default function ProductInfoDialog(props) {

    const classes = useStyles();
    const { row, onClose, open} = props;

    const productID=row.cells.filter(cell=>cell.column.Header==="Id")[0].value;

    const [product,setProduct]=useState(null);
    const [supplier,setSupplier]=useState(null);
    const [categories, setCategories]=useState([]);

    const loadProductByID=()=>{
        console.log(`Entering...${productID}`);
        axios.get(`${url}/api/products/${productID}`)
            .then(response => {
                console.log("Loading product details...");
                console.log(response);

                setSupplier(response.data.supplier);
                setCategories(response.data.categories);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const mountSupplier=()=>{
        return(
            <TextField
                    fullWidth
                    label="Company name"
                    InputProps={{
                        readOnly: true,
                    }}
                    disabled
                    variant="outlined"
                    defaultValue={supplier.companyName}
                />
        )
    }

    const mountCategories=()=>{

        const tempCategories=categories.map(category=>(
            <TextField
                    fullWidth
                    label="Category name"
                    InputProps={{
                        readOnly: true,
                    }}
                    disabled
                    variant="outlined"
                    defaultValue={category.name}
                />
        ));

        return(
            <>
                {tempCategories}
            </>
        )
    }

    return (
        <>
            <Dialog
                onClose={onClose}
                open={open}
                onEntered={loadProductByID}
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
                        {supplier?mountSupplier():null}
                        {categories?mountCategories():null}
                    </form>
                </DialogContent>
                <DialogActions>
                    <button className="btn btn-light" onClick={onClose}>
                        Ok
                    </button>
                </DialogActions>
            </Dialog>
        </>
    )
}
