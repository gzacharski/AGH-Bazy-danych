import React, {useContext, useEffect, useState} from 'react';
import Table from '../components/table/Table';
import axios from 'axios';
import CustomerContext from "../layouts/CustomerContext";

export default function Orders() {

    const [orders, setOrders] = useState([]);
    const columns = [
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
    const customerId = useContext(CustomerContext);

    useEffect(loadOrders, []);

    function loadOrders() {
        axios.get('http://localhost:3000/api/customers/' + customerId + '/orders')
            .then(response => {
                console.log(response);
                setOrders(response.data.nodes);
                console.log("Orders returned from API:")
                console.log(response.data.nodes);
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <div>
            <Table title="Orders" data={orders} columns={columns} />
        </div>
    );
}