import AddCategoryDialog from '../dialogs/addRowDialogs/AddCategoryDialog';
import AddCustomerDialog from '../dialogs/addRowDialogs/AddCustomerDialog';
import AddOrderDialog from '../dialogs/addRowDialogs/AddOrderDialog';
import AddProductDialog from '../dialogs/addRowDialogs/AddProductDialog';
import AddSupplierDialog from '../dialogs/addRowDialogs/AddSupplierDialog';
import IconButton from '@material-ui/core/IconButton';
import { IoMdAdd } from 'react-icons/io';
import React, { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';


export default function AddButton(props) {

    const {add,title}=props;

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const addDialog=(add,title,open)=>{

        if(title==="Categories"){
            return (<AddCategoryDialog  open={open} onClose={handleClose} create={add}/>);

        }else if(title==="Customers"){
            return (<AddCustomerDialog  open={open} onClose={handleClose} create={add}/>);

        }else if(title==="Orders"){
            return (<AddOrderDialog  open={open} onClose={handleClose} create={add}/>);
            
        }else if(title==="Products"){
            return (<AddProductDialog  open={open} onClose={handleClose} create={add}/>);

        }else if(title==="Suppliers"){
            return (<AddSupplierDialog open={open} onClose={handleClose} create={add}/>);
        }
    }

    return(
        <>
            {
                title === "Stats for categories" || title === "Stats for products" ||
                <Tooltip title="Add">
                    <IconButton aria-label="Add" onClick={handleOpen}>
                        <IoMdAdd/>
                    </IconButton>
                </Tooltip>
            }
            {addDialog(add,title,open)}
        </>
    );
}
