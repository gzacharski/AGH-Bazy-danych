import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import React, { Component } from 'react';
import { Snackbar } from '@material-ui/core';
import Table from '../components/table/Table';
import { url } from '../config/config';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Suppliers extends Component {

    state = {
        suppliers: [],
        errorMsg: '',
        columns : [
            { Header: 'Id', accessor: 'id.low' },
            { Header: 'Company name', accessor: 'companyName' },
            { Header: 'Contact name', accessor: 'contactName' },
            { Header: 'Contact title', accessor: 'contactTitle' },
            { Header: 'Phone', accessor: 'phone' },
            { Header: 'Country', accessor: 'country' },
            { Header: 'Address', accessor: 'address' },
            { Header: 'City', accessor: 'city' },
            { Header: 'Postal code', accessor: 'postalCode' },
        ],
        openSnackbar: false,
        response: {
            success: false,
            message: ''
        }
    }

    componentDidMount() {
        axios.get(`${url}/api/suppliers`)
            .then(response => {
                this.setState({ suppliers: response.data.nodes })
            })
            .catch(error => {
                console.log(error);
            })
    }

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ openSnackbar: false })
    };

    createSupplier =(supplier)=>{
        console.log("Creating new supplier...");
        this.setState(prevState=>({
            suppliers: [...prevState.suppliers,supplier]
        }))
    }

    readSupplier =(supplier) =>{
        console.log("Read specified supplier...");
        console.log(supplier);
    }

    updateSupplier = async (updatedSupplier)=>{

        const theSupplier = {
            id: {
                low: updatedSupplier.cells[0].value,
                high: 0
            },
            companyName: updatedSupplier.cells[1].value,
            contactName: updatedSupplier.cells[2].value,
            contactTitle: updatedSupplier.cells[3].value,
            phone: updatedSupplier.cells[4].value,
            country: updatedSupplier.cells[5].value,
            address: updatedSupplier.cells[6].value,
            city: updatedSupplier.cells[7].value,
            postalCode: updatedSupplier.cells[8].value
        }

        const updatedSuppliers=this.state.suppliers.map(
            supplier=>(supplier.id.low===theSupplier.id.low?theSupplier:supplier)
        )

        await axios.put(`${url}/api/suppliers/${theSupplier.id.low}`,{
            companyName: theSupplier.companyName,
            contactName: theSupplier.contactName,
            contactTitle: theSupplier.contactTitle,
            phone: theSupplier.phone,
            country: theSupplier.country,
            address: theSupplier.address,
            city: theSupplier.city,
            postalCode: theSupplier.postalCode
        })
            .then(response=>{
                console.log(response);

                if (response.status === 200) {
                    this.setState({
                        suppliers: updatedSuppliers,
                        response: {
                            success: true,
                            message: 'Supplier has been updated.'
                        },
                        openSnackbar: true
                    });

                } else {
                    this.setState({
                        response: {
                            success: false,
                            message: 'Supplier could not been updated.'
                        },
                        openSnackbar: true
                    });
                }
            })
            .catch(error=>{
                console.log(error);
                this.setState({
                    response: {
                        success: false,
                        message: 'Error :( Category could not been updated.'
                    },
                    openSnackbar: true
                });
            })
        
        return this.state.response;
    }

    deleteSupplier =async (removedSupplier)=>{

        const id = removedSupplier.cells[0].value;

        const updatedSuppliers=this.state.suppliers.filter(
            supplier=>supplier.id.low!==id
        );

        await axios.delete(`${url}/api/suppliers/${id}`)
            .then(response => {
                console.log(response);

                if (response.status === 200) {
                    this.setState({
                        suppliers: updatedSuppliers,
                        response: {
                            success: true,
                            message: 'Supplier has been deleted.'
                        },
                        openSnackbar: true
                    });
                } else {
                    this.setState({
                        response: {
                            success: false,
                            message: 'Supplier could not been deleted.'
                        },
                        openSnackbar: true
                    });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    response: {
                        success: false,
                        message: 'Error! Something went wrong. :('
                    },
                    openSnackbar: true
                });
            })

        return this.state.response;
    }

    render() {
        const { suppliers, columns, openSnackbar,response} = this.state;

        return (
            <>
                <div>
                    <Table 
                        title="Suppliers" 
                        data={suppliers} 
                        columns={columns} 
                        crudActions={{
                            create : this.createSupplier,
                            read : this.readSupplier,
                            update : this.updateSupplier,
                            remove : this.deleteSupplier
                        }}
                    />
                </div>
                <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={this.handleCloseSnackbar}>
                    <Alert
                        onClose={this.handleCloseSnackbar}
                        severity={response.success ? "success" : "error"}
                    >
                        {response.message}
                    </Alert>
                </Snackbar>
            </>
        );
    };
}

export default Suppliers;