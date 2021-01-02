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
1. Wystartowanie Neo4j wraz z bazą Northwind w kontenerze Dockerowym:
   ```shell script
    docker-compose up -d
    ```
1. Zainstalowanie bibliotek dla back-endu:
    ```shell script
    npm install
    ```
1. Wystartowanie aplikacji back-endu:
    ```shell script
    npm start
    ```

1. Zainstalowanie bibliotek dla front-endu:
    ```shell script
    cd front-end
    npm install
    ```
1. Wystartowanie aplikacji front-endu:
    ```shell script
    npm start
    ```

## Testowanie

1. Uruchomienie testów
    ```shell script
    npm test
    ```
