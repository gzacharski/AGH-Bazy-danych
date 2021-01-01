import React from 'react';

const Header = () => {

    return(
        <header className="navbar navbar-light bg-light text-dark text-center">
             <div className="container-fluid">
                <a className="navbar-brand">Baza Northwind</a>
                <form className="d-flex">
                    <input className="form-control me-2" type="search" placeholder="Szukaj" aria-label="Szukaj"/>
                    <button className="btn btn-outline-success" type="submit">Szukaj</button>
                </form>
            </div>
        </header>
    );
}

export default Header;