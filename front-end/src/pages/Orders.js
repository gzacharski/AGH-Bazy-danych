import React, {useEffect, useState} from 'react';
import Table from '../components/table/Table';
import axios from 'axios';

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

    useEffect(loadOrders, []);

    function loadOrders() {
        axios.get('http://localhost:3000/api/orders/old')
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

    const createOrder =(order)=>{
        console.log("Creating new Order...");
        console.log("Appending new Order to Table...");
        console.log(order);
        setOrders([...orders,order]);
    }

    const readOrder =(Order) =>{
        console.log("Read specified Order...");
        console.log(Order);
    }

    const updateOrder =(Order)=>{
        console.log("Update specified Order...");
        console.log(Order);
    }

    const deleteOrder =(Order)=>{
        console.log("Delete specified Order...");
        console.log(Order);
    }

    return (
        <div>
            <Table 
                title="Orders" 
                data={orders} 
                columns={columns}
                crudActions={{
                    create: createOrder,
                    read: readOrder,
                    update: updateOrder,
                    remove: deleteOrder
                }} 
            />
        </div>
    );
}