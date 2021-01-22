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
        { Header: 'Id', accessor: 'id' },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Quantity per unit', accessor: 'quantityPerUnit' },
        { Header: 'Unit price', accessor: 'unitPrice' },
        { Header: 'Units in stock', accessor: 'unitsInStock' },
        { Header: 'Reorder level', accessor: 'reorderLevel' },
        { Header: 'Discontinued', accessor: 'discontinued' },
        { Header: 'Units on order', accessor: 'unitsOnOrder' }
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

    const updateProduct = async (updatedProduct) => {
        console.log("Update specified Product...");
        console.log(updatedProduct);

        const productID=updatedProduct.productID;
        const tempProduct=updatedProduct.product;

        const updatedProductsTable=products
            .map(product=>{
                if(Number.parseInt(product.id)===productID){
                    product={
                        discontinued: tempProduct.discontinued,
                        id: productID,
                        name: tempProduct.name,
                        quantityPerUnit: tempProduct.quantityPerUnit,
                        reorderLevel: tempProduct.reorderLevel,
                        unitPrice: tempProduct.unitPrice,
                        unitsInStock: tempProduct.unitsInStock,
                        unitsOnOrder: tempProduct.unitsOnOrder,
                    };
                }
                
                return product;
            });

        await axios.put(`${url}/api/products/${productID}`,updatedProduct)
            .then(response=>{
                console.log(response);
                if(response.status===201){
                    setResponse({
                        success: true,
                        message: 'Product has been updated.'
                    });
                    setOpenSnackbar(true);
                    setProducts(updatedProductsTable);
                }else{
                    setResponse({
                        success: false,
                        message: 'Product could not been updated.'
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
            });

        return response;
    }

    const deleteProduct = async (removedProduct) => {
        console.log("Delete specified Product...");

        const productID=removedProduct.cells
            .filter(cell=>cell.column.Header==="Id")[0]
            .value;

        const updatedProductsTable=products
            .filter(product=>Number.parseInt(product.id)!==productID);

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