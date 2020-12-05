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
0. Jeżeli pracujesz na Windowsie musisz odpalić polecenie np. w GitBashu, aby skonwertować znaki końca linii na Unixowe:
   ```shell script
    sed -i -e 's/\r$//' entrypointWrapper-windows.sh
    ```
1. Wystartowanie Neo4j wraz z bazą Northwind w kontenerze Dockerowym:
   ```shell script
    docker-compose -f docker-compose.yaml  up -d
    ```
1. Zainstalowanie bibliotek
    ```shell script
    npm install
    ```
1. Wystartowanie aplikacji:
    ```shell script
    npm start
    ```
   
## Testowanie

1. Uruchomienie testów
    ```shell script
    npm test
    ```
