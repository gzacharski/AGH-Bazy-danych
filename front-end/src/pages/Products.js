import React, { useEffect, useState } from 'react'
import Table from '../components/table/Table';
import axios from 'axios';

export default function Products() {
    const [products, setProducts] = useState([]);
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
        axios.get('http://localhost:3000/api/products')
            .then(response => {
                console.log(response);
                setProducts(response.data.nodes);
                console.log("Products loaded: ");
                console.log(response.data.nodes);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const createProduct = (product) => {
        console.log("Creating new Product...");
        console.log(product);
    }

    const readProduct = (product) => {
        console.log("Read specified Product...");
        console.log(product);
    }

    const updateProduct = (product) => {
        console.log("Update specified Product...");
        console.log(product);
    }

    const deleteProduct = (product) => {
        console.log("Delete specified Product...");
        console.log(product);
    }

    return (
        <div>
            <Table
                title="Products"
                data={products}
                columns={columns}
                crudActions={{
                    create: createProduct,
                    read: readProduct,
                    update: updateProduct,
                    remove: deleteProduct
                }}
            />
        </div>
    );
}