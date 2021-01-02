import React, {Component} from 'react';
import SupplierTable from '../components/tables/SupplierTable';
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
                console.log(this.state.suppliers);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render(){
        const {suppliers, errorMsg} =this.state;

        return(
            <div>
                <span className="text-center"><h1>Suppliers</h1></span>
                <SupplierTable data={suppliers}/>
            </div>
        );
    };
}

export default Suppliers;