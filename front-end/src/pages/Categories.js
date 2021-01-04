import React, { Component } from 'react';
import Table from '../components/table/Table';
import axios from 'axios';

class Categories extends Component {

    state = {
        categories: [],
        errorMsg: '',
        columns : [
            // { Header: 'Id', accessor: 'id.low'},
            { Header: 'Name', accessor: 'name' },
            { Header: 'Description', accessor: 'description' }
        ]
    }

    componentDidMount() {
        axios.get('http://localhost:3000/api/categories')
            .then(response => {
                console.log(response);
                this.setState({ categories: response.data.nodes })
                console.log(this.state.categories);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        const { categories, errorMsg, columns} = this.state;

        return (
            <div>
                <Table title="Categories" data={categories} columns={columns} />
            </div>
        );
    };
}

export default Categories;