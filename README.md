# AGH-Bazy-danych
Celem projektu jest zaimplementowanie systemu realizującego wybrane podstawowe operacje w przykładowej bazie Northwind w wybranej technologii.

## Uczestnicy
1. Bartosz Kordek (kordek@student.agh.edu.pl)
2. Marcin Włodarczyk (mwlodarc@student.agh.edu.pl)
3. Grzegorz Zacharski (gzacharski@student.agh.edu.pl)

## Technologie
* Front-end: React (opcjonalnie)
* Back-end: Node.js oraz Express.js (REST API)
* Bazy danych: grafowa baza danych Neo4J
* Konteneryzacja: Docker
* Ciągła integracja (CI): GitHub Actions

## Uruchamianie

1. Wystartowanie Neo4j w kontenerze Dockerowym:
    ```shell script
    docker-compose up -d
    ```
1. Utworzenie bazy Northwind (o ile nie była wcześniej utworzona) i dodanie danych:
    ```shell script
    ./createDatabase.sh
    ```
1. Wystartowanie aplikacji:
    ```shell script
    npm start
    ```