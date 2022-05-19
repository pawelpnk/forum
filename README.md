# Forum

Aplikacja napisana w React.js, TypeScript oraz NestJS. Wykorzystana baza danych to PostgreSQL.

[Demo aplikacji](https://sleepy-badlands-09970.herokuapp.com)

## Podstawowe informacje

Aplikacja została stworzona na potrzeby dalszej nauki wyżej wymienionych technologii. Jest implementacją forum na bazie własnego pomysłu. Aplikacja oferuje takie funkcjonalności jak:
- Możliwość zakładania kont oraz logowania
- Zakładanie nowych sekcji przez administratora
- Dodawanie nowych tematów oraz postów przez zalogowanych użytkowników
- Posty mogą być edytowane tylko przez właścicieli lub administratora
- Posty i tematy mogą być usuwane tylko przez administratora
- Możliwość pozytywnej i negatywnej oceny posta
- Możliwość oznaczenia użytkownika w poście
- Powiadomienia o oznaczeniach w postach w czasie rzeczywistym i możliwość przejścia do tematu z oznaczeniem
- Komunikator w czasie rzeczywistym do prywatnych rozmów
- Gra snake dostępna na desktopie oraz możliwość zbierania punktów
- Banowanie użytkowników oraz automatyczne odbanowanie

## Instalacja
Lokalna instalacja jest możliwa poprzez pobranie aplikacji, skonfigurowanie dostępu do bazy danych, a następnie uruchomienie w folderze z frontendem oraz backendem serwera poprzez wpisanie komendy:

`npm start`

Przykładowa konfiguracja bazy danych z stworzeniem pliku `ormconfig.json`, a następnie umieszczenie go w folderze głównym forum-backend:

`
"type":"postgres",
"host":"localhost",
"port":5432,
"username":"postgres",
"password":"Twoje hasło do bazy danych",
"database":"forum",
"entities":["dist/**/**/*.entity{.ts,.js}"]
`

## Użyte technologie
- React.js
- TypeScript
- NestJS
- PosgreSQL
- Bootstrap 5
- CSS
- HTML
- Passport-JWT
- Socket.IO
- Server Sent Event
