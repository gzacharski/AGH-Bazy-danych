import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import React, {useEffect, useState} from 'react';
import { Snackbar } from '@material-ui/core';
import Table from '../components/table/Table';
import { url } from '../config/config';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Orders() {

    const [orders, setOrders] = useState([]);
    const columns = [
        { Header: 'Id', accessor: 'id' },
        { Header: 'Ship name', accessor: 'shipName' },
        { Header: 'Ship city', accessor: 'shipCity' },
        { Header: 'Ship country', accessor: 'shipCountry' },
        { Header: 'Ship address', accessor: 'shipAddress' },
        { Header: 'Ship postal code', accessor: 'shipPostalCode' },
        { Header: 'Shipped date', accessor: 'shippedDate' },
        { Header: 'Freight', accessor: 'freight' },
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

    const [response, setResponse] = useState({ success: false, message: "" });
    const [openSnackbar,setOpenSnackbar]=useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

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

    const updateOrder = (Order)=>{
        console.log("Update specified Order...");
        console.log(Order);
    }

    const deleteOrder =async (removedOrder)=>{
        console.log("Delete specified Order...");

        const orderID=removedOrder.cells
            .filter(cell=>cell.column.Header==="Id")[0]
            .value;

        const updatedOrdersTable=orders
            .filter(order=>Number.parseInt(order.id)!==orderID);

        await axios.delete(`${url}/api/orders/${orderID}`)
            .then(response=>{

                if(response.status===200){
                    setResponse({
                        success: true,
                        message: 'Order has been deleted.'
                    });
                    setOpenSnackbar(true);
                    setOrders(updatedOrdersTable);
                }else{
                    setResponse({
                        success: false,
                        message: 'Order could not been deleted.'
                    });
                    setOpenSnackbar(true);
                }
            })
            .catch(error=>{
                console.log(error);
                setResponse({
                    success: false,
                    message: 'Error! Something went wrong. :('
                });
                setOpenSnackbar(true);
            })

        return response;
    }

    return (
        <>
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
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={response.success ? "success" : "error"}
                >
                    {response.message}
                </Alert>
            </Snackbar>
        </>
    );
}