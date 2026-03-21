# 🛡️ HRL User Hub

Główny portal ekosystemu **HardbanRecords Lab** — kompleksowa platforma SaaS dla niezależnych twórców, artystów i wytwórni.

## 🚀 O projekcie

HRL User Hub to centralne miejsce zarządzania karierą cyfrową. Platforma integruje zaawansowane narzędzia AI z modułami dystrybucji, marketingu i analityki, dając twórcom pełną kontrolę nad ich własnością intelektualną.

### Kluczowe moduły:
- **Muzyka**: Dystrybucja na 38+ platform streamingowych, zarządzanie prawami i split sheets.
- **Publikacje**: Wydawanie e-booków i audiobooków (z generatorem AI) na globalnych rynkach.
- **Marketing**: Strategie AI, smart links, automatyzacja PR i planowanie social media.
- **AI Studio**: Profesjonalne narzędzia do generowania treści, grafik i masteringu audio.
- **Prometheus**: Zaawansowany ekosystem automatyzacji i dystrybucji treści.

## 🛠️ Technologia

- **Frontend**: React 18, Vite, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Supabase (Baza danych, Auth, Edge Functions)
- **AI Engine**: Gemini 2.5 Flash
- **PWA**: Pełne wsparcie offline i instalacja jako aplikacja.

## 📦 Instalacja i uruchomienie

1. Sklonuj repozytorium.
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

Aplikacja jest zoptymalizowana pod wdrożenie na **Vercel** (`vercel.json`) lub **Netlify** (`netlify.toml`).

### Oficjalne adresy:
- **Frontend (Vercel)**: [app-user-hub.hardbanrecordslab.online](https://app-user-hub.hardbanrecordslab.online)
- **Backend (VPS)**: `user-hub.hardbanrecordslab.online`

### Zmienne środowiskowe:
Wymagane do poprawnego działania integracji z Supabase:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_USER_HUB_API` (opcjonalnie, domyślnie: `https://user-hub.hardbanrecordslab.online`)

---
© 2026 **HardbanRecords Lab** · Wszystkie prawa zastrzeżone.
