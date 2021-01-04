import React, {Component} from 'react'
import Table from '../components/table/Table';
import axios from 'axios';

class Customers extends Component{

    state={
        customers: [],
        errorMsg: '',
        columns: [
            { Header: 'Id', accessor: 'id' },
            { Header: 'Name', accessor: 'name' },
            { Header: 'Title', accessor: 'title' },
            { Header: 'Company', accessor: 'company' },
            { Header: 'City', accessor: 'city' },
            { Header: 'Address', accessor: 'address' },
            { Header: 'Country', accessor: 'country' },
            { Header: 'Phone', accessor: 'phone' },
            { Header: 'Postal code', accessor: 'postalCode' },
            { Header: 'Fax', accessor: 'fax' }
        ]
    }

    componentDidMount(){
        axios.get('http://localhost:3000/api/customers')
            .then(response=>{
                console.log(response);
                this.setState({customers: response.data.nodes})
                console.log(this.state.customers);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render(){
        const {customers, errorMsg,columns} =this.state;

        return(
            <div>
                <span className="text-center"><h1>Customers</h1></span>
                <Table data={customers} columns={columns}/>
            </div>
        );
    };
}

export default Customers;
