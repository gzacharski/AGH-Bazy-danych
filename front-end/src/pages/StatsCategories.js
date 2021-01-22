import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import React, {useEffect, useState} from 'react';
import {Snackbar} from '@material-ui/core';
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
    const [openSnackbar, setOpenSnackbar] = useState(null);
    const [response, setResponse] = useState({success: false, message: ''});

    useEffect(getCategories, []);

    function getCategories() {
        axios.get(`${url}/stats/categories/2`)
            .then(response => {
                console.log(response.data)
                setStats([response.data])
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
                <Table
                    title="Stats for categories"
                    data={stats}
                    columns={columns}
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
