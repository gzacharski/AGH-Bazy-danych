import React from 'react'

function Home() {
    return (
        <div className="home">
            <h1>Bazy danych - projekt</h1>
            <br/>
            <h3>O projekcie</h3>
            <span>Projekt jest realizowany w ramach przedmiotu Bazy danych na kierunku Informatyka na studiach niestacjonarnych w roku akademickim 2020/2021 na
                Wydziale Informatyki, Elektroniki i Telekomunikacji Akademii Górniczo-Hutniczej im. St. Staszica w Krakowie.</span>
            <br/>
            <br/>
            <h3>Cel projektu</h3>
            <span>Celem projektu jest zaimplementowanie systemu realizującego wybrane podstawowe operacje w przykładowej bazie Northwind w wybranej technologii.</span>
            <br/>
            <br/>
            <h3>Zakres projektu</h3>
            <ul>
                <li>Operacje CRUD na wybranych tabelach</li>
                <li>Operacje składania zamówień na produkty</li>
                <li>Operacje wyszukiwania informacji i raportowania</li>
            </ul>
            <br/>
            <h3>Dodatkowe informacje</h3>
            <ul>
                <li><a href="https://github.com/gzacharski/AGH-Bazy-danych/wiki" target="_blank">Dokumentacja</a></li>
                <li><a href="https://github.com/gzacharski/AGH-Bazy-danych" target="_blank">Repozytorium</a></li>
            </ul>
        </div>
    )
}

export default Home;