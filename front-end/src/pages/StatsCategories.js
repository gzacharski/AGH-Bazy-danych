import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import React, {Component, useEffect, useState} from 'react';
import {Button, FormControl, InputLabel, Menu, MenuItem, Select, Snackbar} from '@material-ui/core';
import Table from '../components/table/Table';
import { url } from '../config/config';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function StatsCategories() {
    const columns = [
        { Header: 'categoryName', accessor: 'categoryName' },
        { Header: 'Total Income', accessor: 'totalIncome' },
        { Header: 'Total Units Sold', accessor: (row) => {
                if (row.totalUnitsSold.low) {
                    return row.totalUnitsSold.low;
                }
                return row.totalUnitsSold
            }},
        { Header: 'Average Price', accessor: 'averagePrice' },
        { Header: 'Average Discount', accessor: 'averageDiscount' },
        { Header: 'Most Sold Product', accessor: 'mostSoldProduct' },
        { Header: 'Most Sold Product Units Sold', accessor: (row) => {
                if (row.mostSoldProductUnitsSold.low) {
                    return row.mostSoldProductUnitsSold.low;
                }
                return row.mostSoldProductUnitsSold
        }}
    ];
    const [stats, setStats] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(null);
    const [response, setResponse] = useState({success: false, message: ''});

    useEffect(getCategories, []);

    function getCategories() {
        axios.get(`${url}/stats/categories/1`)
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
                    crudActions={{
                        create: () => console.log("create"),
                        read: () => console.log("read"),
                        update: () => console.log("update"),
                        remove: () => console.log("remove")
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
