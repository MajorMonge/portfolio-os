# i18n System Usage Examples

## Basic Usage in React Components

### Using the `useTranslation` hook

```tsx
import { useTranslation } from "@/i18n";

function MyComponent() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div>
      {/* Simple translation */}
      <h1>{t("home.message")}</h1>

      {/* Translation with variables */}
      <p>{t("home.welcome", { name: "John" })}</p>

      {/* Show current locale */}
      <p>Current locale: {locale}</p>

      {/* Change locale */}
      <button onClick={() => setLocale("en-US")}>English</button>
      <button onClick={() => setLocale("pt-BR")}>Português</button>
    </div>
  );
}
```

## Using Translation Functions Directly

```tsx
import { translate, getLocale } from "@/i18n";

// Get a translation for current locale
const currentLocale = getLocale();
const message = translate("home.message", currentLocale);

// With variables
const welcome = translate("home.welcome", "pt-BR", { name: "Maria" });
```

## Adding New Translations

### 1. Add to `src/i18n/locales/en-us.ts`:

```typescript
export default {
  translations: {
    home: {
      message: "Hello World!",
      welcome: "Welcome, {{name}}!",
    },
    common: {
      close: "Close",
      minimize: "Minimize",
      maximize: "Maximize",
    },
    // Add your new translations here
    myFeature: {
      title: "My Feature",
      description: "This is my feature",
    },
  },
};
```

### 2. Add to `src/i18n/locales/pt-br.ts`:

```typescript
export default {
  translations: {
    home: {
      message: "Olá Mundo!",
      welcome: "Bem-vindo, {{name}}!",
    },
    common: {
      close: "Fechar",
      minimize: "Minimizar",
      maximize: "Maximizar",
    },
    // Add your new translations here
    myFeature: {
      title: "Minha Funcionalidade",
      description: "Esta é minha funcionalidade",
    },
  },
};
```

## Features

- **Persistent Storage**: The selected locale is saved to localStorage automatically
- **Reactive**: Components using `useTranslation()` will re-render when locale changes
- **Variable Interpolation**: Use `{{variableName}}` in translations and pass values
- **Nested Keys**: Use dot notation to access nested translations (e.g., `common.close`)
- **Fallback**: If a translation key is not found, the key itself is returned

## API Reference

### `useTranslation()`

React hook that provides translation functionality.

Returns:

- `t(key, variables?)`: Translation function
- `locale`: Current locale ('pt-BR' | 'en-US')
- `setLocale(locale)`: Function to change the locale

### `translate(key, locale, variables?)`

Direct translation function (non-reactive).

### `$localeStore`

Nanostores atom containing the current locale. Persists to localStorage.
