import axios from 'axios';
import {
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
    Select,
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
                    label="Supplier company name"
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

        const selectedCategories=categories.map(category=>(
            <MenuItem
                key={category.id.low}
                value={category}
            >
                {category.name}
            </MenuItem>
        ));

        return(
            <FormControl fullWidth>
                <InputLabel id="multiple-category-label">Category</InputLabel>
                <Select
                    labelId="multiple-category-label"
                    id="category-label"
                    value={categories}
                    // onChange={handleSelectedCategoriesChange}
                    multiple
                    disabled
                    input={<Input id="select-multiple-chip" />}
                    renderValue={selected => (
                        <div className={classes.chips}>
                            {selected.map(value => (
                                <Chip key={value.id.low} label={value.name} className={classes.chip} />
                            ))}
                        </div>
                    )}
                    MenuProps={MenuProps}
                >
                    {selectedCategories}
                </Select>
            </FormControl>
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
                        {supplier?mountSupplier():<CircularProgress color="primary" />}
                        {categories?mountCategories():<CircularProgress color="primary" />}
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
