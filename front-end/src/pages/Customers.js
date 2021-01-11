import React, {Component} from 'react'
import Table from '../components/table/Table';
import axios from 'axios';

class Customers extends Component{

    state={
        customers: [],
        errorMsg: '',
        columns: [
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

    createCustomer =(customer)=>{
        console.log("Creating new Customer...");
        console.log(customer);
    }

    readCustomer =(customer) =>{
        console.log("Read specified Customer...");
        console.log(customer);
    }

    updateCustomer =(customer)=>{
        console.log("Update specified Customer...");
        console.log(customer);
    }

    deleteCustomer =(customer)=>{
        console.log("Delete specified Customer...");
        console.log(customer);
    }

    render(){
        const {customers, columns} =this.state;

        return(
            <div>
                <Table 
                    title="Customers" 
                    data={customers} 
                    columns={columns}
                    crudActions={{
                        create : this.createCustomer,
                        read : this.readCustomer,
                        update : this.updateCustomer,
                        remove : this.deleteCustomer,
                    }}
                />
            </div>
        );
    };
}

export default Customers;
