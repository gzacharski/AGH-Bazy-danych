import React, { Component } from 'react';
import Table from '../components/Table';
import axios from 'axios';

class Suppliers extends Component {

    state = {
        suppliers: [],
        errorMsg: '',
        columns : [
            { Header: 'Id', accessor: 'id.low' },
            { Header: 'Country', accessor: 'country' },
            { Header: 'Address', accessor: 'address' },
            { Header: 'Contact title', accessor: 'contactTitle' },
            { Header: 'City', accessor: 'city' },
            { Header: 'Phone', accessor: 'phone' },
            { Header: 'Contact name', accessor: 'contactName' },
            { Header: 'Postal code', accessor: 'postalCode' },
            { Header: 'Company name', accessor: 'companyName' },
        ]
    }

    componentDidMount() {
        axios.get('http://localhost:3000/api/suppliers')
            .then(response => {
                console.log(response);
                this.setState({ suppliers: response.data.nodes })
                console.log(this.state.suppliers);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        const { suppliers, errorMsg, columns} = this.state;

        return (
            <div>
                <span className="text-center"><h1>Suppliers</h1></span>
                <Table data={suppliers} columns={columns} />
            </div>
        );
    };
}

export default Suppliers;