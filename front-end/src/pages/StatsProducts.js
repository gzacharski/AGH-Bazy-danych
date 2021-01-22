import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import React, { Component } from 'react';
import { Snackbar } from '@material-ui/core';
import Table from '../components/table/Table';
import { url } from '../config/config';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class StatsProducts extends Component {

    state = {
        stats: [],
        errorMsg: '',
        columns: [
            { Header: 'Product Name', accessor: 'productName' },
            { Header: 'Total Income', accessor: 'totalIncome' },
            { Header: 'Total Units Sold', accessor: 'totalUnitsSold' },
            { Header: 'Average Price', accessor: 'averagePrice' },
            { Header: 'Average Discount', accessor: 'averageDiscount' },
            { Header: 'Max Discount', accessor: 'maxDiscount' },
            { Header: 'Countries Shipped', accessor: row => row.countriesShipped.sort().join(", ") }
        ],
        openSnackbar: false,
        response: {
            success: false,
            message: ''
        }
    }

    componentDidMount() {
        axios.get(`${url}/stats/products`)
            .then(response => {
                this.setState({ stats: response.data })
            })
            .catch(error => {
                console.log(error);
            })
    }

    handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ openSnackbar: false })
    };

    render() {
        const { stats, columns, openSnackbar, response } = this.state;

        return (
            <>
                <div>
                    <Table
                        title="Stats for products"
                        data={stats}
                        columns={columns}
                        crudActions={{
                        }}
                    />
                </div>
                <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={this.handleCloseSnackbar}>
                    <Alert
                        onClose={this.handleCloseSnackbar}
                        severity={response.success ? "success" : "error"}
                    >
                        {response.message}
                    </Alert>
                </Snackbar>
            </>
        );
    };
}

export default StatsProducts;