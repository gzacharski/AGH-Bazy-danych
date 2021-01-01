import React, {Component} from 'react';
import {SupplierTable} from '../components/SupplierTable';
import axios from 'axios';

class Suppliers extends Component{

    constructor(props){
        super(props)

        this.state={
            suppliers: [],
            errorMsg: ''
        }
    }

    componentDidMount(){
        axios.get('http://localhost:3000/api/suppliers')
            .then(response=>{
                console.log(response);
                this.setState({suppliers: response.data.nodes})
            })
            .catch(error => {
                console.log(error);
            })
    }

    render(){
        const {suppliers, errorMsg} =this.state;

        return(
            <div>
                SupplierTable
                <SupplierTable data={suppliers}/>
                {/* {
                    suppliers.length ? suppliers.map(
                        supplier => <div key={supplier.id}>{supplier.companyName}</div>
                    ):null
                }
                {errorMsg ? <div>{errorMsg}</div>:null} */}
            </div>
        );
    };
}

export default Suppliers;