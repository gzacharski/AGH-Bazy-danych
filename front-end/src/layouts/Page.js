import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Categories from '../pages/Categories';
import Customers from '../pages/Customers';
import Employees from '../pages/Employees';
import Home from '../pages/Home';
import Orders from '../pages/Orders';
import Products from '../pages/Products';
import Regions from '../pages/Regions';
import Shippers from '../pages/Shippers';
import Suppliers from '../pages/Suppliers';

const Page = () => {
    return (
        <div className="container">
                <main>
                    <Switch>
                        <Route path='/categories' component={Categories} />
                        <Route path='/customers' component={Customers} />
                        <Route path='/employees' component={Employees} />
                        <Route path='/' exact component={Home} />
                        <Route path='/orders' component={Orders} />
                        <Route path='/products' component={Products} />
                        <Route path='/regions' component={Regions} />
                        <Route path='/shippers' component={Shippers} />
                        <Route path='/suppliers' component={Suppliers} />
                    </Switch>
                </main>
        </div>
    );
}

export default Page;