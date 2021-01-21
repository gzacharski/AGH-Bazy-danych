import axios from 'axios';
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
    Backdrop,
    CircularProgress,
    Chip,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import React, {useState, useEffect} from "react";
import MuiAlert from '@material-ui/lab/Alert';
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
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
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

export default function EditProductDialog(props) {

    const classes = useStyles();
    const {onClose, open,updateRow} = props;
    const [row,setRow]=useState(props.row);

    const productID=row.cells.filter(cell=>cell.column.Header==="Id")[0].value;

    const [product,setProduct]=useState(null);
    const [suppliers,setSuppliers]=useState([]);
    const [selectedSupplier,setSelectedSupplier]=useState(null);
    const [categories, setCategories]=useState([]);
    const [selectedCategories, setSelectedCategories]=useState(null);

    const [openBackdrop, setOpenBackdrop] = useState(false);
    const handleCloseBackdrop = () => setOpenBackdrop(false);
    const handleToggleBackdrop = () => setOpenBackdrop(!openBackdrop);

    const handleChange = property => ({ target: { value } }) => {
        setProduct({ ...product, [property]: value })
    }

    const handleCancel=()=>{
        setProduct(null);
        setSuppliers([]);
        setSelectedSupplier(null);
        setCategories([]);
        setSelectedCategories(null);
        onClose();
    }

    //useEffect(loadProductByID, []);
    const loadData = ()=>{
        loadProductByID();
        loadSuppliers();
        loadCategories();
    }

    function loadProductByID(){
        axios.get(`${url}/api/products/${productID}`)
            .then(response => {
                
                const tempProduct=response.data.product;
                setProduct({
                    unitPrice: tempProduct.unitPrice,
                    unitsInStock: tempProduct.unitsInStock.low,
                    reorderLevel: tempProduct.reorderLevel.low,
                    name: tempProduct.name,
                    quantityPerUnit: tempProduct.quantityPerUnit,
                    discontinued: tempProduct.discontinued.low,
                    unitsOnOrder: tempProduct.unitsOnOrder.low
                });
                setSelectedSupplier(response.data.supplier);
                setSelectedCategories(response.data.categories);
            })
            .catch(error => {
                console.log(error);
            })
    }

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

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log("Submit form..");

        handleToggleBackdrop();
        onClose();

        updateRow({
            productID,
            product,
            supplier: selectedSupplier,
            categories : selectedCategories
        })
            .then(response=>{
                console.log(response);
                setSelectedCategories(null);
                setProduct(null);
                setSelectedSupplier(null);

                handleCloseBackdrop();
            })
            .catch(error=>{
                setSelectedCategories(null);
                setProduct(null);
                setSelectedSupplier(null);
                handleCloseBackdrop();
                console.log(error);
            })
    }

    const handleChangeCheckbox=()=>{
        setProduct({...product,
            discontinued : product.discontinued===0?1:0
        });
    }

    const productDetails=()=>{
        console.log({selectedSupplier,selectedCategories,product});
        return(
            <>
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
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={product.discontinued===1?true:false}
                        onChange={handleChangeCheckbox}
                        name="discontinued"
                        color="primary"
                    />
                    }
                    label="Discontinued"
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
            </>
        );
    }

    const handleSupplierChange = (event) => {
        setSelectedSupplier(event.target.value);
    };

    const getSupplierIndex=(id,suppliers)=>{
        for(let i=0; i<suppliers.length; i++){
            if(suppliers[i].id.low===id){
                return i;
            }
        }
        return "";
    }

    const convertSuppliersToSelectItems = () => {

        const supplierSelectItems = suppliers.map(supplier => (
            <MenuItem key={supplier.id.low} value={supplier}>
                {supplier.companyName}
            </MenuItem>
        ));

        return (
            <FormControl fullWidth required>
                <InputLabel id="supplier-select-label">Supplier</InputLabel>
                <Select
                    labelId="supplier-select-label"
                    id="supplier-select"
                    value={suppliers[getSupplierIndex(selectedSupplier.id.low,suppliers)]}
                    onChange={handleSupplierChange}
                >   
                    {supplierSelectItems}
                </Select>
            </FormControl>
        );
    }

    const handleSelectedCategoriesChange = (_, selectedOptions) => {
        setSelectedCategories(selectedOptions);
    }

    const convertCategoriesToMultipleSelect = () => {
        const categoriesToShow = categories.map(category => (
            <MenuItem key={category.id.low} value={category} selected={true}>
                {category.name}
            </MenuItem>
        ));
        
        return (
            <>
            <Autocomplete
                id="combo-box-category"
                multiple
                fullWidth
                disableCloseOnSelect
                value={selectedCategories}
                options={categories}
                getOptionLabel={option => option.name}
                getOptionSelected={(option, value) => value.id.low === option.id.low}
                renderInput={params => (
                    <TextField {...params} label="Categories" variant="outlined" fullWidth />
                )}
                renderOption={(option, { selected }) => (
                    <>
                        <Checkbox
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.name}
                    </>
                )}
                onChange={handleSelectedCategoriesChange}
                />
            </>
        );
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
                <Dialog onClose={onClose} open={open} onEntered={loadData}>
                    <DialogTitle>Edit Product</DialogTitle>
                    <Divider />
                    <DialogContent>
                        <form id="editForm" className={classes.root} onSubmit={handleSubmit} noValidate>
                            {
                                product!==null
                                ?productDetails()
                                :<CircularProgress color="primary"/>
                            }
                            {
                                selectedSupplier!==null
                                ?convertSuppliersToSelectItems()
                                :<CircularProgress color="primary"/>
                            }
                            {
                                selectedCategories!==null
                                ?convertCategoriesToMultipleSelect() 
                                :<CircularProgress color="primary"/>
                            }
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <button className="btn btn-light" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="submit" form="editForm" className="btn btn-light" >
                            Edit
                        </button>
                    </DialogActions>
                </Dialog>
            }
        </>
    )
}
