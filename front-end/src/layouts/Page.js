import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Suppliers from '../pages/Suppliers';

const Page = () => {
    return (
        <div className="container">
            <main>
                <Switch>
                    <Route path='/' exact component={Home}/>
                    <Route path='/suppliers' component={Suppliers}/>
                </Switch>
            </main>
        </div>
    );
}

export default Page;