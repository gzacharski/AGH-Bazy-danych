import React, { Component } from 'react';
import Table from '../components/table/Table';
import axios from 'axios';
import {url} from '../config/config';

class Categories extends Component {

    state = {
        categories: [],
        errorMsg: '',
        columns: [
            { Header: 'Id', accessor: 'id.low' },
            { Header: 'Name', accessor: 'name' },
            { Header: 'Description', accessor: 'description' }
        ]
    }

    componentDidMount() {
        axios.get(`${url}/api/categories`)
            .then(response => {
                console.log(response);
                this.setState({ categories: response.data.nodes })
                console.log(this.state.categories);
            })
            .catch(error => {
                console.log(error);
            })
    }

    createCategory = (category) => {
        console.log("Creating new Category...");
        console.log(category);
    }

    readCategory = (category) => {
        console.log("Read specified Category...");
        console.log(category);
    }

    updateCategory = (updatedCategory) => {

        const theCategory = {
            id: {
                low: updatedCategory.cells[0].value,
                high: 0
            },
            name: updatedCategory.cells[1].value,
            description: updatedCategory.cells[2].value
        }

        const updatedCategories = this.state.categories.map(category => {
            if (category.id.low === theCategory.id.low) {
                return theCategory;
            } else {
                return category;
            }
        })

        this.setState({
            categories: updatedCategories
        });

        axios.put(`${url}/api/categories/${theCategory.id.low}`, {
            name: theCategory.name,
            description: theCategory.description
        })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
    }

    deleteCategory = (removedCategory) => {
        
        console.log(removedCategory);

        const id=removedCategory.cells[0].value;

        const updatedCategories=this.state.categories.filter(category=>category.id.low!==id);

        this.setState({
            categories: updatedCategories
        });

        axios.delete(`${url}/api/categories/${id}`)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        const { categories, columns } = this.state;

        return (
            <div>
                <Table
                    title="Categories"
                    data={categories}
                    columns={columns}
                    crudActions={{
                        create: this.createCategory,
                        read: this.readCategory,
                        update: this.updateCategory,
                        remove: this.deleteCategory
                    }}
                />
            </div>
        );
    };
}

export default Categories;