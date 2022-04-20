# Forum

Aplikacja napisana w React.js wraz z TypeScriptem oraz NestJS z PostgreSQL.

## Podstawowe informacje

Aplikacja została stworzona na potrzeby dalszej nauki wyżej wymienionych technologii. Jest implementacją forum na bazie własnego pomysłu. Aplikacja na dzień 20.04.2022 oferuje takie funkcjonalności jak:
- Możliwość zakładania kont oraz logowania
- Zakładanie nowych sekcji przez administratora
- Dodawanie nowych tematów oraz postów
- Posty mogą być edytowanie tylko przez właścicieli lub administratora
- Posty i tematy mogą być usuwane tylko przez administratora
- Możliwość pozytywnej i negatywnej oceny posta
- Możliwość oznaczenia użytkownika w poście
- Powiadomienia po zalogowaniu o oznaczeniach i możliwość przejścia do tematu z oznaczeniem

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
