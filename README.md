# 🚍 Svelte 5 Public Transport Scraper

Projekt wykonany na zaliczenie egzaminu. Aplikacja webowa zbudowana w oparciu o **Svelte 5, SvelteKit, TypeScript i Tailwind CSS**, której celem jest pobieranie oraz wyświetlanie aktualnych odjazdów autobusów i tramwajów z pobliskich przystanków przy uczelni. Dane są pobierane ze strony [ZDMiKP Bydgoszcz](http://odjazdy.zdmikp.bydgoszcz.pl/) poprzez web scraping.

## 💪 Technologie

- [Svelte 5](https://svelte.dev/) – nowoczesny framework frontendowy
- [SvelteKit](https://kit.svelte.dev/) – pełny zestaw narzędzi do budowy aplikacji
- [TypeScript](https://www.typescriptlang.org/) – statycznie typowany JavaScript
- [Tailwind CSS](https://tailwindcss.com/) – szybkie i nowoczesne style
- [Cheerio](https://cheerio.js.org/) – biblioteka do parsowania HTML

## 🔧 Instalacja i uruchomienie

1. Sklonuj repozytorium:
   ```sh
   git clone https://github.com/wsmajt/bus-scheduler-pbs.git
   ```

2. Zainstaluj zależności:
   ```sh
   npm install
   ```

3. Uruchom aplikację:
   ```sh
   npm run dev
   ```

## 🌐 Podgląd działania

Aplikacja wyświetla listę najbliższych odjazdów autobusów i tramwajów na podstawie danych pobranych ze strony ZDMiKP Bydgoszcz. Wyniki są prezentowane w czytelny sposób z podziałem na linie, przystanki i godziny.
![obraz](https://github.com/user-attachments/assets/c869adfe-fa8a-4b9a-bb78-85fc9ad60813)
