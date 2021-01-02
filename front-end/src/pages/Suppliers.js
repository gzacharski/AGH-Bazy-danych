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
                this.setState({suppliers: response.data})
            })
            .catch(error => {
                console.log(error);
            })
    }

    render(){
        const {suppliers, errorMsg} =this.state;

        return(
            <div>
                <SupplierTable data={suppliers}/>
            </div>
        );
    };
}

export default Suppliers;