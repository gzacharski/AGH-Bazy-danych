import React, { Component } from 'react';
import Table from '../components/table/Table';
import axios from 'axios';

class Orders extends Component {

    state = {
        orders: [],
        errorMsg: '',
        columns : [
            { Header: 'Id', accessor: 'id.low' },
            { Header: 'Ship name', accessor: 'shipName' },
            { Header: 'Ship city', accessor: 'shipCity' },
            { Header: 'Ship country', accessor: 'shipCountry' },
            { Header: 'Ship address', accessor: 'shipAddress' },
            { Header: 'Ship postal code', accessor: 'shipPostalCode' },
            { Header: 'Shipped date', accessor: 'shippedDate' },
            { Header: 'Freight', accessor: 'freight.low' },
            { Header: 'Required date', accessor: 'requiredDate' },
            { Header: 'Order date', accessor: 'orderDate' }
        ]
    }

    componentDidMount() {
        axios.get('http://localhost:3000/api/orders')
            .then(response => {
                console.log(response);
                this.setState({ orders: response.data.nodes })
                console.log(this.state.orders);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        const { orders, errorMsg, columns} = this.state;

        return (
            <div>
                <Table title="Orders" data={orders} columns={columns} />
            </div>
        );
    };
}

export default Orders;