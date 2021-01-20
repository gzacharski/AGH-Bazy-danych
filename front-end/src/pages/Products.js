import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import { Snackbar } from '@material-ui/core';
import Table from '../components/table/Table';
import { url } from '../config/config';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
    const [response, setResponse] = useState({ success: false, message: "" });
    const [openSnackbar,setOpenSnackbar]=useState(false);

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

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const createProduct = (product) => {
        console.log("Creating new Product...");
        console.log("Appending new Product to Table...");
        console.log(product);
        setProducts([...products,product]);
    }

    const readProduct = (product) => {
        console.log("Read specified Product...");
        console.log(product);
    }

    const updateProduct = (product) => {
        console.log("Update specified Product...");
        console.log(product);
    }

    const deleteProduct = async (removedProduct) => {
        console.log("Delete specified Product...");

        const productID=removedProduct.cells
            .filter(cell=>cell.column.Header==="Id")[0]
            .value;

        const updatedProductsTable=products
            .filter(product=>Number.parseInt(product.id.low)!==productID);

        await axios.delete(`${url}/api/products/${productID}`)
            .then(response=>{

                if(response.status===200){
                    setResponse({
                        success: true,
                        message: 'Product has been deleted.'
                    });
                    setOpenSnackbar(true);
                    setProducts(updatedProductsTable);
                }else{
                    setResponse({
                        success: false,
                        message: 'Product could not been deleted.'
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