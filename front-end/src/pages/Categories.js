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

    createCategory =(category)=>{
        console.log("Creating new Category...");
        console.log(category);
    }

    readCategory =(category) =>{
        console.log("Read specified Category...");
        console.log(category);
    }

    updateCategory =(category)=>{
        console.log("Update specified Category...");
        console.log(category);
    }

    deleteCategory =(category)=>{
        console.log("Delete specified Category...");
        console.log(category);
    }

    render() {
        const { categories, columns} = this.state;

        return (
            <div>
                <Table 
                    title="Categories" 
                    data={categories} 
                    columns={columns} 
                    crudActions={{
                        create : this.createCategory,
                        read : this.readCategory,
                        update : this.updateCategory,
                        remove : this.deleteCategory
                    }}
                />
            </div>
        );
    };
}

export default Categories;