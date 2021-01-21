import axios from 'axios';
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
    Input,
    InputLabel,
    MenuItem,
    Snackbar,
    Select,
    TextField,
    Slide,
    Tooltip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useState, useEffect } from 'react';
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
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

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
    const [supplier, setSupplier] = useState('');
    const [suppliers, setSuppliers] = useState(null);
    const [categories, setCategories] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [responseSuccess, setResponseSuccess] = useState(false);

    useEffect(loadSuppliers, []);

    function loadSuppliers() {
        axios.get(`${url}/api/suppliers`)
            .then(response => {
                console.log("Loading suplliers...");
                console.log(response);
                setSuppliers(response.data.nodes);
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(loadCategories, []);

    function loadCategories() {
        axios.get(`${url}/api/categories`)
            .then(response => {
                console.log("Loading categories...");
                console.log(response);
                setCategories(response.data.nodes);
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

    const handleSupplierChange = (event) => {
        setSupplier(event.target.value);
    };

    const addProduct = () => {
        console.log("Adding product...");
        console.log({
            product,
            supplier,
            categories: selectedCategories
        });

        setResponseSuccess(false);
        handleToggleBackdrop();
        onClose();
        axios
            .post(`${url}/api/products`, {
                product,
                supplier,
                categories: selectedCategories
            })
            .then(response => {
                console.log(response);

                setProduct(initProduct);
                setSupplier(null);
                setSelectedCategories([]);

                if (response.status == 201) {
                    setResponseSuccess(true);
                    handleCloseBackdrop();
                    handleClickSnackbar();
                    create(response.data.product);
                } else {
                    setResponseSuccess(false);
                    handleCloseBackdrop();
                    handleClickSnackbar();
                }
            })
            .catch(error => {

                setResponseSuccess(false);
                setProduct(initProduct);
                setSupplier(null);
                setSelectedCategories([]);

                handleCloseBackdrop();
                handleClickSnackbar();

                console.log(error);
            })
    }

    const handleCancel = () => {
        onClose();
        setProduct(initProduct);
        setSupplier(null);
        setSelectedCategories([]);
    }

    const convertSuppliersToSelectItems = () => {

        const supplierSelectItems = suppliers.map(supplier => (
            <MenuItem key={supplier.id} value={supplier}>
                {supplier.companyName}
            </MenuItem>
        ));

        return (
            <FormControl fullWidth>
                <InputLabel id="supplier-select-label">Supplier</InputLabel>
                <Select
                    labelId="supplier-select-label"
                    id="supplier-select"
                    value={supplier}
                    onChange={handleSupplierChange}
                >
                    {supplierSelectItems}
                </Select>
            </FormControl>
        );
    }

    const handleSelectedCategoriesChange = (event) => {
        console.log(event.target.value);
        setSelectedCategories(event.target.value);
    }

    const convertCategoriesToMultipleSelect = () => {

        const categoriesToShow = categories.map(category => (
            <MenuItem
                key={category.id}
                value={category}
            >
                {category.name}
            </MenuItem>
        ));

        return (
            <FormControl fullWidth>
                <InputLabel id="multiple-category-label">Category</InputLabel>
                <Select
                    labelId="multiple-category-label"
                    id="category-label"
                    value={selectedCategories}
                    onChange={handleSelectedCategoriesChange}
                    multiple
                    input={<Input id="select-multiple-chip" />}
                    renderValue={selected => (
                        <div className={classes.chips}>
                            {selected.map(value => (
                                <Chip key={value.id} label={value.name} className={classes.chip} />
                            ))}
                        </div>
                    )}
                    MenuProps={MenuProps}
                >
                    {categoriesToShow}
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
                            type="text"
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
                        {suppliers !== null ? convertSuppliersToSelectItems() : null}
                        {categories !== null ? convertCategoriesToMultipleSelect() : null}
                    </DialogContent>
                    <DialogActions>
                        <button className="btn btn-light" onClick={handleCancel}>
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
                            <span>New product has been added to database.</span>
                            :
                            <span>Couldn't add the product to database.</span>
                    }
                </Alert>
            </Snackbar>
        </>
    )
}
