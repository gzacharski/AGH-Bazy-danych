import React, {useContext, useEffect, useState} from 'react'
import Table from '../components/table/Table';
import axios from 'axios';
import CustomerContext from "../layouts/CustomerContext.js";

export default function Products() {
    const [products, setProducts] = useState([]);
    const customerId = useContext(CustomerContext);
    const columns = [
        { Header: 'Id', accessor: 'id.low' },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Quantity per unit', accessor: 'quantityPerUnit' },
        { Header: 'Unit price', accessor: 'unitPrice' },
        { Header: 'Units in stock', accessor: 'unitsInStock.low' },
        { Header: 'Reorder level', accessor: 'reorderLevel.low' },
        { Header: 'Discontinued', accessor: 'discontinued.low' },
        { Header: 'Units on order', accessor: 'unitsOnOrder.low' }
    ];

    useEffect(loadProducts, []);

    function loadProducts() {
        console.log(customerId);
        axios.get('http://localhost:3000/api/products')
            .then(response=>{
                console.log(response);
                setProducts(response.data.nodes);
                console.log("Products loaded: ");
                console.log(response.data.nodes);
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <div>
            <Table title="Products" data={products} columns={columns} editEnabled={true} removeEnabled={true}/>
        </div>
    );
}