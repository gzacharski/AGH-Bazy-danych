import React, { Component } from 'react';
import Table from '../components/Table';
import axios from 'axios';

class Employees extends Component {

    state = {
        employees: [],
        errorMsg: '',
        columns : [
            { Header: 'Id', accessor: 'id.low' },
            { Header: 'First name', accessor: 'firstName' },
            { Header: 'Last Name', accessor: 'lastName' },
            { Header: 'Date of birth', accessor: 'birthDate' },
            { Header: 'Title', accessor: 'title'},
            { Header: 'Title of courtesy', accessor: 'titleOfCourtesy' },
            { Header: 'Country', accessor: 'country' },
            { Header: 'City', accessor: 'city' },
            { Header: 'Postal code', accessor: 'postalCode' },
            { Header: 'Hire date', accessor: 'hireDate' },
            { Header: 'Address', accessor: 'address' },
            { Header: 'Home phone', accessor: 'homePhone' },
            // { Header: 'Notes', accessor: 'notes' },
            { Header: 'Extension', accessor: 'extension.low' },
            { Header: 'Region', accessor: 'region' },
        ]
    }

    componentDidMount() {
        axios.get('http://localhost:3000/api/employees')
            .then(response => {
                console.log(response);
                this.setState({ employees: response.data.nodes })
                console.log(this.state.employees);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        const { employees, errorMsg, columns} = this.state;

        return (
            <div>
                <span className="text-center"><h1>Employees</h1></span>
                <Table data={employees} columns={columns} />
            </div>
        );
    };
}

export default Employees;