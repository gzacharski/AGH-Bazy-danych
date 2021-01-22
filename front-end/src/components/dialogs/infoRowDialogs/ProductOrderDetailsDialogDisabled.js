import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField 
} from "@material-ui/core";
import React, {useState} from 'react'

export default function ProductOrderDetailsDialogDisabled(props) {

    const {open,onClose}=props;
    const [product,setProduct]=useState(props.product.product);
    const [unitPrice,setUnitPrice]=useState(props.product.unitPrice);
    const [quantity,setQuantity]=useState(props.product.quantity);
    const [discount,setDiscount]=useState(props.product.discount);

    return (
        <Dialog
            onClose={onClose}
            open={open}
        >  
            <DialogTitle>Product details for: <br/> {product.name}</DialogTitle>
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
                    disabled
                />
                <TextField
                    fullWidth
                    id="quantity"
                    label="Quantity"
                    margin="dense"
                    required
                    type="number"
                    value={quantity}
                    disabled
                />
                <TextField
                    fullWidth
                    id="discount"
                    label="Discount"
                    margin="dense"
                    required
                    type="number"
                    value={discount}
                    disabled
                />
            </DialogContent>
            <DialogActions>
                <button className="btn btn-light" onClick={onClose}>
                    ok
                </button>
            </DialogActions>
        </Dialog>
    )
}
