import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';

const initCustomer={
    name: '',
    title: '',
    company: '',
    city: '',
    address: '',
    country: '',
    phone: '',
    postalCode: '',
    fax: ''
}

export default function AddDialog(props) {

    const [customer, setCustomer]=useState(initCustomer);

    const { onClose, open } = props;

    const handleChange = property => ({target : {value}}) =>{
        setCustomer({...customer,[property]: value})
    }

    return (
        <Dialog
            aria-labelledby="dialog-add-entity"
            onClose={onClose}
            open={open}
        >
            <DialogTitle>Add new customer</DialogTitle>
            <Divider/>
            <DialogContent>
                <TextField
                    autoFocus
                    fullWidth
                    id="customer-name"
                    label="Name and surname"
                    margin="dense"
                    required
                    type="text"
                    value={customer.name}
                    onChange={handleChange('name')}
                />
                <TextField
                    fullWidth
                    id="customer-title"
                    label="Title"
                    margin="dense"
                    required
                    type="text"
                    value={customer.title}
                    onChange={handleChange('title')}
                />
                <TextField
                    fullWidth
                    id="customer-company"
                    label="Company"
                    margin="dense"
                    required
                    type="text"
                    value={customer.company}
                    onChange={handleChange('company')}
                />
                <TextField
                    fullWidth
                    id="customer-city"
                    label="City"
                    margin="dense"
                    required
                    type="text"
                    value={customer.city}
                    onChange={handleChange('city')}
                />
                <TextField
                    fullWidth
                    id="customer-address"
                    label="Address"
                    margin="dense"
                    required
                    type="text"
                    value={customer.address}
                    onChange={handleChange('address')}
                />
                <TextField
                    fullWidth
                    id="customer-country"
                    label="Country"
                    margin="dense"
                    required
                    type="text"
                    value={customer.country}
                    onChange={handleChange('country')}
                />
                <TextField
                    fullWidth
                    id="customer-phone"
                    label="Phone"
                    margin="dense"
                    required
                    type="text"
                    value={customer.phone}
                    onChange={handleChange('phone')}
                />
                <TextField
                    fullWidth
                    id="customer-postalCode"
                    label="Postal code"
                    margin="dense"
                    required
                    type="text"
                    value={customer.postalCode}
                    onChange={handleChange('postalCode')}
                />
                <TextField
                    fullWidth
                    id="customer-fax"
                    label="Fax"
                    margin="dense"
                    required
                    type="text"
                    value={customer.fax}
                    onChange={handleChange('fax')}
                />
            </DialogContent>
            <DialogActions>
                <button className="btn btn-light">
                    Cancel
                </button>
                <button className="btn btn-light">
                    Add
                </button>
            </DialogActions>
        </Dialog>
    )
}