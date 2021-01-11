import React, { Component } from 'react';
import Table from '../components/table/Table';
import axios from 'axios';

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
        ]
    }

    componentDidMount() {
        axios.get('http://localhost:3000/api/suppliers')
            .then(response => {
                this.setState({ suppliers: response.data.nodes })
            })
            .catch(error => {
                console.log(error);
            })
    }

    componentDidUpdate(){
        axios.get('http://localhost:3000/api/suppliers')
            .then(response => {
                this.setState({ suppliers: response.data.nodes })
            })
            .catch(error => {
                console.log(error);
            })
    }

    createSupplier =(supplier)=>{
        console.log("Creating new supplier...");
        console.log(supplier);
    }

    readSupplier =(supplier) =>{
        console.log("Read specified supplier...");
        console.log(supplier);
    }

    updateSupplier =(supplier)=>{
        console.log("Update specified supplier...");
        console.log(supplier);
    }

    deleteSupplier =(supplier)=>{
        console.log("Delete specified supplier...");
        console.log(supplier);
    }

    render() {
        const { suppliers, columns} = this.state;

        return (
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
        );
    };
}

export default Suppliers;