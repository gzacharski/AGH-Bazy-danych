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

## Uruchamianie (Linux)
1. Wytworzenie obrazu Dockerowego dla back-endu:
   ```shell script
   docker build -t back-end back-end
   ```
1. Wytworzenie obrazu Dockerowego dla front-endu:
   ```shell script
   docker build -t front-end front-end
   ```
1. Wystartowanie Neo4j wraz z bazą Northwind, back-endu i front-endu w kontenerach Dockerowych:
   ```shell script
   docker-compose -f docker-compose.yaml up -d
   ```

## Uruchamianie (MacOS/Windows)

1. Wystartowanie Neo4j wraz z bazą Northwind w kontenerze Dockerowym:
   ```shell script
    docker-compose -f docker-compose-windows.yaml up -d
    ```
1. Zainstalowanie bibliotek oraz wystartowanie aplikacji back-endu:
    ```shell script
    npm install
    npm start
    ```
1. Zainstalowanie bibliotek oraz wystartowanie aplikacji front-endu:
    ```shell script
    cd front-end
    npm install
    npm start
    ```
   
## Testowanie

1. Uruchomienie testów dla back-endu
    ```shell script
    cd back-end
    npm test
    ```
