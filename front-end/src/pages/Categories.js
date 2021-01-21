import axios from 'axios';
import MuiAlert from '@material-ui/lab/Alert';
import React, { Component } from 'react';
import { Snackbar } from '@material-ui/core';
import Table from '../components/table/Table';
import { url } from '../config/config';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Categories extends Component {

    state = {
        categories: [],
        errorMsg: '',
        columns: [
            { Header: 'Id', accessor: 'id' },
            { Header: 'Name', accessor: 'name' },
            { Header: 'Description', accessor: 'description' }
        ],
        openSnackbar: false,
        response: {
            success: false,
            message: ''
        }
    }

    componentDidMount() {
        axios.get(`${url}/api/categories`)
            .then(response => {
                this.setState({ categories: response.data.nodes })
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

    createCategory = (category) => {
        console.log("Creating new Category...");
        this.setState(prevState => ({
            categories: [...prevState.categories, category]
        }))
    }

    readCategory = (category) => {
        console.log("Read specified Category...");
        console.log(category);
    }

    updateCategory = async (updatedCategory) => {

        const theCategory = {
            id: updatedCategory.cells[0].value,
            name: updatedCategory.cells[1].value,
            description: updatedCategory.cells[2].value
        }

        const updatedCategories = this.state.categories.map(
            category => (category.id === theCategory.id ? theCategory : category)
        )

        await axios.put(`${url}/api/categories/${theCategory.id}`, {
            name: theCategory.name,
            description: theCategory.description
        })
            .then(response => {
                console.log(response);

                if (response.status === 200) {
                    this.setState({
                        categories: updatedCategories,
                        response: {
                            success: true,
                            message: 'Category has been updated.'
                        },
                        openSnackbar: true
                    });

                } else {
                    this.setState({
                        response: {
                            success: false,
                            message: 'Category could not been updated.'
                        },
                        openSnackbar: true
                    });
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    response: {
                        success: false,
                        message: 'Error :( Category could not been updated.'
                    },
                    openSnackbar: true
                });
            })

        return this.state.response;
    }

    deleteCategory = async (removedCategory) => {

        console.log(removedCategory);

        const id = removedCategory.cells[0].value;

        const updatedCategories = this.state.categories.filter(
            category => category.id !== id
        );

        let hasBeenRemoved = {
            success: false,
            message: ''
        };

        await axios.delete(`${url}/api/categories/${id}`)
            .then(response => {
                console.log(response);

                if (response.status === 200) {

                    hasBeenRemoved.success = true;
                    hasBeenRemoved.message = response.data.message;

                    this.setState({
                        categories: updatedCategories,
                        response: hasBeenRemoved,
                        openSnackbar: true
                    });
                }
            })
            .catch(error => {
                console.log(error);
            })

        return hasBeenRemoved;
    }

    render() {
        const { categories, columns, openSnackbar, response } = this.state;

        return (
            <>
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

export default Categories;