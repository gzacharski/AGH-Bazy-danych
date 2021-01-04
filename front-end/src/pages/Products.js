import React, {Component} from 'react'
import Table from '../components/table/Table';
import axios from 'axios';

class Products extends Component{

    state={
        products: [],
        errorMsg: '',
        columns: [
            { Header: 'Id', accessor: 'id.low' },
            { Header: 'Name', accessor: 'name' },
            { Header: 'Quantity per unit', accessor: 'quantityPerUnit' },
            { Header: 'Unit price', accessor: 'unitPrice' },
            { Header: 'Units in stock', accessor: 'unitsInStock.low' },
            { Header: 'Reorder level', accessor: 'reorderLevel.low' },
            { Header: 'Discontinued', accessor: 'discontinued.low' },
            { Header: 'Units on order', accessor: 'unitsOnOrder.low' }
        ]
    }

    componentDidMount(){
        axios.get('http://localhost:3000/api/products')
            .then(response=>{
                console.log(response);
                this.setState({products: response.data.nodes})
                console.log(this.state.products);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render(){
        const {products, errorMsg,columns} =this.state;

        return(
            <div>
                <Table title="Products" data={products} columns={columns}/>
            </div>
        );
    };
}

export default Products;