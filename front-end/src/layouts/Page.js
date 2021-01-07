import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Categories from '../pages/Categories';
import Customers from '../pages/Customers';
import Home from '../pages/Home';
import Orders from '../pages/Orders';
import Products from '../pages/Products';
import Suppliers from "../pages/Suppliers";

const Page = () => {
    return (
        <div className="container">
                <main>
                    <Switch>
                        <Route path='/categories' component={Categories} />
                        <Route path='/customers' component={Customers} />
                        <Route path='/' exact component={Home} />
                        <Route path='/orders' component={Orders} />
                        <Route path='/products' component={Products} />
                        <Route path='/suppliers' component={Suppliers} />
                    </Switch>
                </main>
        </div>
    );
}

export default Page;