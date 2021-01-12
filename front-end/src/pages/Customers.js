import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import React, { Component } from 'react';
import { Snackbar } from '@material-ui/core';
import Table from '../components/table/Table';
import { url } from '../config/config';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Customers extends Component {

    state = {
        customers: [],
        errorMsg: '',
        columns: [
            { Header: 'Id', accessor: 'id' },
            { Header: 'Name', accessor: 'name' },
            { Header: 'Title', accessor: 'title' },
            { Header: 'Company', accessor: 'company' },
            { Header: 'City', accessor: 'city' },
            { Header: 'Address', accessor: 'address' },
            { Header: 'Country', accessor: 'country' },
            { Header: 'Phone', accessor: 'phone' },
            { Header: 'Postal code', accessor: 'postalCode' },
            { Header: 'Fax', accessor: 'fax' }
        ],
        openSnackbar: false,
        response: {
            success: false,
            message: ''
        }
    }

    componentDidMount() {
        axios.get(`${url}/api/customers`)
            .then(response => {
                console.log(response);
                this.setState({ customers: response.data.nodes })
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

    createCustomer = (customer) => {
        console.log("Creating new Customer...");
        this.setState(prevState=>({
            customers: [...prevState.customers,customer]
        }))
    }

    readCustomer = (customer) => {
        console.log("Read specified Customer...");
        console.log(customer);
    }

    updateCustomer = async (updatedCustomer) => {
        console.log("Update specified Customer...");

        const theCustomer = {
            id: updatedCustomer.cells[0].value,
            name: updatedCustomer.cells[1].value,
            title: updatedCustomer.cells[2].value,
            company: updatedCustomer.cells[3].value,
            city: updatedCustomer.cells[4].value,
            address: updatedCustomer.cells[5].value,
            country: updatedCustomer.cells[6].value,
            phone: updatedCustomer.cells[7].value,
            postalCode: updatedCustomer.cells[8].value,
            fax: updatedCustomer.cells[9].value,
        }

        const updatedCustomers = this.state.customers.map(
            customer => (customer.id === theCustomer.id ? theCustomer : customer)
        )

        await axios.put(`${url}/api/customers/${theCustomer.id}`, {
            id: theCustomer.id,
            name: theCustomer.name,
            title: theCustomer.title,
            company: theCustomer.company,
            city: theCustomer.city,
            address: theCustomer.address,
            country: theCustomer.country,
            phone: theCustomer.phone,
            postalCode: theCustomer.postalCode,
            fax: theCustomer.fax
        }).then(response => {

            if (response.status === 200) {
                this.setState({
                    customers: updatedCustomers,
                    response: {
                        success: true,
                        message: 'Customer has been updated.'
                    },
                    openSnackbar: true
                });
            } else {
                this.setState({
                    response: {
                        success: false,
                        message: 'Customer could not been updated.'
                    },
                    openSnackbar: true
                });
            }

        }).catch(error => {
            console.log(error);
            this.setState({
                response: {
                    success: false,
                    message: 'Error :( Customer could not been updated.'
                },
                openSnackbar: true
            });
        })

        return this.state.response;
    }

    deleteCustomer = async (removedCustomer) => {
        console.log("Delete specified Customer...");
        console.log(removedCustomer);

        const id = removedCustomer.cells[0].value;

        const updatedCustomers = this.state.customers.filter(
            customer => customer.id !== id
        );

        await axios.delete(`${url}/api/customers/${id}`)
            .then(response => {
                console.log(response);

                if (response.status === 200) {
                    this.setState({
                        customers: updatedCustomers,
                        response: {
                            success: true,
                            message: response.data.message
                        },
                        openSnackbar: true
                    });
                } else {
                    this.setState({
                        response: {
                            success: false,
                            message: response.data.message
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
        const { customers, columns, openSnackbar, response } = this.state;

        return (
            <>
                <div>
                    <Table
                        title="Customers"
                        data={customers}
                        columns={columns}
                        crudActions={{
                            create: this.createCustomer,
                            read: this.readCustomer,
                            update: this.updateCustomer,
                            remove: this.deleteCustomer,
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

export default Customers;
