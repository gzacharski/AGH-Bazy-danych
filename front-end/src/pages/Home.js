import React from 'react'

function Home() {
    return (
        <div className="home">
            <h1>Home</h1>
            <br/>
            <h3>O projekcie</h3>
            <span>Projekt jest realizowany w ramach przedmiotu Bazy danych na kierunku Informatyka na studiach niestacjonarnych w roku akademickim 2020/2021 na
                Wydziale Informatyki, Elektroniki i Telekomunikacji Akademii Górniczo-Hutniczej im. St. Staszica w Krakowie.</span>
            <br/>
            <h3>Cel projektu</h3>
            <span>Celem projektu jest zaimplementowanie systemu realizującego wybrane podstawowe operacje w przykładowej bazie Northwind w wybranej technologii.</span>
            <br/>
            <h3>Do zrealizowania</h3>
            <ul>
                <li>Operacje CRUD na wybranych tabelach</li>
                <li>Operacje składania zamówień na produkty</li>
                <li>Operacje wyszukiwania informacji i raportowania</li>
            </ul>
            <br/>
            <h3>Dodatkowe informacje</h3>
            <ul>
                <li><a href="https://github.com/gzacharski/AGH-Bazy-danych/wiki">Dokumentacja</a></li>
                <li><a href="https://github.com/gzacharski/AGH-Bazy-danych">Repozytorium</a></li>
            </ul>
        </div>
    )
}

export default Home;