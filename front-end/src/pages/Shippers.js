import React, { Component } from 'react';
import Table from '../components/table/Table';
import axios from 'axios';

class Shippers extends Component {

    state = {
        shippers: [],
        errorMsg: '',
        columns : [
            { Header: 'Id', accessor: 'id.low' },
            { Header: 'Phone', accessor: 'phone' },
            { Header: 'Company name', accessor: 'companyName' }
        ]
    }

    componentDidMount() {
        axios.get('http://localhost:3000/api/shippers')
            .then(response => {
                console.log(response);
                this.setState({ shippers: response.data.nodes })
                console.log(this.state.shippers);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        const { shippers, errorMsg, columns} = this.state;

        return (
            <div>
                <Table title="Shippers" data={shippers} columns={columns} />
            </div>
        );
    };
}

export default Shippers;