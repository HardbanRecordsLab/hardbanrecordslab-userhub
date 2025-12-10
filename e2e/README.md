# E2E Tests - HardbanRecords Lab

## Struktura testów

```
e2e/
├── playwright.config.ts   # Konfiguracja Playwright
├── tests/
│   ├── auth.spec.ts       # Testy autentykacji
│   ├── navigation.spec.ts # Testy nawigacji i routingu
│   ├── dashboard.spec.ts  # Testy dashboardu
│   └── accessibility.spec.ts # Testy dostępności
└── README.md
```

## Instalacja

```bash
# Zainstaluj Playwright
npm install -D @playwright/test

# Zainstaluj przeglądarki
npx playwright install
```

## Uruchamianie testów

```bash
# Wszystkie testy
npx playwright test

# Testy w trybie headed (widoczna przeglądarka)
npx playwright test --headed

# Konkretny plik
npx playwright test tests/auth.spec.ts

# Z raportem HTML
npx playwright test --reporter=html

# Tryb UI (interaktywny)
npx playwright test --ui
```

## Konfiguracja

Testy korzystają z:
- **baseURL**: `http://localhost:5173` (dev server)
- **browsers**: Chromium, Firefox, Mobile Safari
- **retries**: 2 na CI, 0 lokalnie

## Zmienne środowiskowe

```bash
BASE_URL=https://your-app.vercel.app npx playwright test
CI=true npx playwright test
```

## Pokrycie testów

### Autentykacja (`auth.spec.ts`)
- ✅ Wyświetlanie formularza logowania
- ✅ Przełączanie zakładek (login/register/reset)
- ✅ Walidacja pól formularza
- ✅ Wymagania hasła (12+ znaków)
- ✅ Wysyłanie żądania logowania
- ✅ Wysyłanie żądania rejestracji
- ✅ Reset hasła

### Nawigacja (`navigation.spec.ts`)
- ✅ Strona główna
- ✅ FAQ
- ✅ Polityka prywatności (/privacy i /privacy-policy)
- ✅ Regulamin
- ✅ 404 dla nieznanych ścieżek
- ✅ Redirect chronionych stron do /auth
- ✅ Responsywność (mobile/desktop)

### Dashboard (`dashboard.spec.ts`)
- ✅ Redirect bez autoryzacji
- ✅ Loading states
- ✅ Empty states

### Dostępność (`accessibility.spec.ts`)
- ✅ Struktura nagłówków (h1)
- ✅ Labele formularzy
- ✅ Dostępność przycisków
- ✅ Nawigacja klawiaturą
- ✅ Alt text obrazów
- ✅ ARIA roles dla tabs

## Dobre praktyki

1. **Nie używaj selektorów CSS** - preferuj role i labele
2. **Używaj `getByRole`, `getByLabel`, `getByText`**
3. **Czekaj na elementy** - `await expect(locator).toBeVisible()`
4. **Testuj user flows, nie implementację**
