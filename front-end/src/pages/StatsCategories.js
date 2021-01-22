import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import React, {useEffect, useState} from 'react';
import {MenuItem, Snackbar, TextField} from '@material-ui/core';
import Table from '../components/table/Table';
import { url } from '../config/config';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function StatsCategories() {
    const columns = [
        { Header: 'Category Name', accessor: 'categoryName' },
        { Header: 'Total Income Generated', accessor: 'totalIncomeGenerated' },
        { Header: 'Total Units Sold', accessor: 'totalUnitsSold' },
        { Header: 'Average Price', accessor: 'averagePrice' },
        { Header: 'Average Discount', accessor: 'averageDiscount' },
        { Header: 'Total Units In Stock', accessor: 'totalUnitsInStock' },
        { Header: 'Most Sold Product', accessor: 'mostSoldProduct' },
        { Header: 'Units Sold Of Most Sold Product', accessor: 'mostSoldProductUnitsSold' },
        { Header: 'Supplier For Most Sold Product', accessor: 'mostSoldProductSupplier' }
    ];
    const [stats, setStats] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(null);
    const [response, setResponse] = useState({success: false, message: ''});
    const [selectedCategory, setSelectedCategory] = useState(1)
    const [anchorEl, setAnchorEl] = useState(false)

    useEffect(getCategories, [selectedCategory]);

    function getCategories() {
        axios.get(`${url}/stats/categories/` + selectedCategory)
            .then(response => {
                console.log("Getting stats for category " + selectedCategory)
                console.log(response.data)
                setStats([response.data])
            })
            .catch(error => {
                console.log(error);
            })

        axios.get(`${url}/api/categories`)
            .then(response => {
                console.log("Getting categories...")
                console.log(response.data.nodes)
                setCategories(response.data.nodes)
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false)
    };

    return (
        <>
            <div>
                <TextField
                    required={true}
                    id="category"
                    select
                    label="Select Category"
                    value="asdfajsdflksdfl"
                    onChange={() => console.log()}
                >
                    {categories.map((category) => (
                        <MenuItem key={category.id} onClick={() => setSelectedCategory(category.id)}>{category.name}</MenuItem>
                    ))}
                </TextField>
                <Table
                    title="Stats for categories"
                    data={stats}
                    columns={columns}
                    crudActions={{}}
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
