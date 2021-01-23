# AGH-Bazy-danych
Celem projektu jest zaimplementowanie systemu realizującego wybrane podstawowe operacje w przykładowej bazie Northwind w wybranej technologii.

## Uczestnicy
1. Bartosz Kordek (kordek@student.agh.edu.pl)
2. Marcin Włodarczyk (mwlodarc@student.agh.edu.pl)
3. Grzegorz Zacharski (gzacharski@student.agh.edu.pl)

## Dokumentacja
Dokumentacja projektu jest dostępna w sekcji [Wiki](https://github.com/gzacharski/AGH-Bazy-danych/wiki).

## Technologie
* Front-end: React
* Back-end: Node.js oraz Express.js (REST API)
* Bazy danych: grafowa baza danych Neo4J
* Konteneryzacja: Docker
* Ciągła integracja (CI): GitHub Actions

## Uruchamianie
1. Wystartowanie Neo4j wraz z bazą Northwind, back-endu i front-endu w kontenerach Dockerowych 
   (uruchamianie może trwać kilka minut):
   ```shell script
   docker-compose up
   ```
1. Aplikacja front-endu będzie dostępna pod adresem http://localhost:4000
1. Konsola bazy danych jest dostępna pod adresem http://localhost:7474 
   (dane do zalogowania URL: `neo4j://localhost:7687`, user: `neo4j`, pass: `test`, baza: `northwind`)

## Testowanie

1. Uruchomienie testów dla back-endu
    ```shell script
    cd back-end
    npm test
    ```
