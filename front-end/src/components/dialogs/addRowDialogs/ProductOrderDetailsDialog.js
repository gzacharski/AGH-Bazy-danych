import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField 
} from "@material-ui/core";
import React, {useState} from 'react'

export default function ProductOrderDetailsDialog(props) {

    const {open,onClose,add}=props;
    const [product,setProduct]=useState(props.product);
    const [unitPrice,setUnitPrice]=useState(props.product.details.unitPrice);
    const [quantity,setQuantity]=useState(props.product.details.quantity);
    const [discount,setDiscount]=useState(props.product.details.discount);

    const handleAddProductDetails=()=>{
        let tempProduct=product;
        tempProduct.details={unitPrice,quantity,discount}
        add(tempProduct);
        onClose();
    }

    return (
        <Dialog
            onClose={onClose}
            open={open}
        >  
            <DialogTitle>Set product details for: <br/> {product.data.name}</DialogTitle>
            <Divider />
            <DialogContent>
                <TextField
                    fullWidth
                    id="unitPrice"
                    label="Unit Price"
                    margin="dense"
                    required
                    type="number"
                    value={unitPrice}
                    onChange={(event)=>setUnitPrice(event.target.value)}
                />
                <TextField
                    fullWidth
                    id="quantity"
                    label="Quantity"
                    margin="dense"
                    required
                    type="number"
                    value={quantity}
                    onChange={(event)=>setQuantity(event.target.value)}
                />
                <TextField
                    fullWidth
                    id="discount"
                    label="Discount"
                    margin="dense"
                    required
                    type="number"
                    value={discount}
                    onChange={(event)=>setDiscount(event.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <button className="btn btn-light" onClick={onClose}>
                    Cancel
                </button>
                <button className="btn btn-light" onClick={handleAddProductDetails}>
                    Add
                </button>
            </DialogActions>
        </Dialog>
    )
}
