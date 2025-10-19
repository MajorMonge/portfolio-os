# portfolio-os

A personal portfolio website that imitates the look and feel of an operating system. It showcases projects and achievements in an interactive, playful environment with window-like UIs, draggable popups, desktop icons, and more.

---

## Features

- **Desktop Environment**: Full OS-inspired interface with desktop, taskbar, and system widgets
- **Window Management**: Draggable, resizable windows with minimize/maximize functionality
- **Multi-language Support**: Built-in internationalization (i18n) system
- **Notion Integration**: Dynamic content loading from Notion databases
- **Theme System**: Customizable themes including Windows 95-inspired styling
- **Responsive Design**: Built with Tailwind CSS and DaisyUI components

---

## Technologies & Architecture

### Frontend Framework

- **Astro** (v5.x) - Modern static site generator with partial hydration for optimal performance
- **@astrojs/node** (v9.x) - Node.js adapter for server-side rendering and API routes
- **@astrojs/preact** (v4.x) - Preact integration for reactive components

### UI & Styling

- **Preact** (v10.x) - Lightweight React alternative for interactive components (3KB)
- **Tailwind CSS** (v4.x) - Utility-first CSS framework with JIT compilation
- **@tailwindcss/vite** - Vite plugin for Tailwind CSS integration
- **DaisyUI** (v5.x) - Tailwind-based component library for consistent UI elements
- **Sass** (v1.x) - CSS preprocessor for advanced styling and theming
- **PostCSS** - CSS transformation with autoprefixer, cssnano, and other plugins

### State Management

- **Nanostores** (v1.x) - Tiny state manager (less than 1KB)
- **@nanostores/preact** - Preact bindings for nanostores
- **@nanostores/persistent** - Persistent storage with localStorage integration

### Content & Data

- **@notionhq/client** (v5.x) - Official Notion API client for dynamic content management

### Development Tools

- **TypeScript** (v5.x) - Static type checking
- **Vite** - Next-generation build tool

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm package manager

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/MajorMonge/portfolio-os.git
   cd portfolio-os
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration:**

   Create a `.env` file (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

   Add your Notion API credentials:

   ```env
   NOTION_TOKEN=your_notion_integration_token_here
   NOTION_DATA_SOURCE_ID=your_data_source_id
   NOTION_ENTRY_PAGE_ID=your_entry_page_id
   ```

4. **Run Development Server:**

   ```bash
   npm run dev
   ```

   Available at `http://localhost:4321`

5. **Build for Production:**

   ```bash
   npm run build
   ```

6. **Preview Production Build:**

   ```bash
   npm run preview
   ```

7. **Run Production Server:**
   ```bash
   npm start
   ```

---

## Project Structure

```
portfolio-os/
├── .astro/              # Astro-generated types and cache
├── .vscode/             # VS Code workspace settings and configurations
├── public/              # Static assets (fonts, images, favicon)
│   ├── fonts/           # Custom fonts (ArialPixel, MS Sans Serif, Ruler)
│   └── img/             # Images and graphics
├── src/
│   ├── components/      # Preact components
│   │   ├── Desktop/           # Desktop environment component
│   │   ├── Window/            # Window management component
│   │   ├── Taskbar/           # Taskbar component
│   │   ├── TaskbarWidgets/    # System widgets (clock, theme selector, etc.)
│   │   └── ...
│   ├── connections/     # External API connections (Notion)
│   ├── helpers/         # Utility functions
│   ├── i18n/            # Internationalization
│   │   ├── locales/           # Language files (en-us, pt-br)
│   │   ├── hooks.ts           # i18n hooks
│   │   └── utils.ts           # Translation utilities
│   ├── layouts/         # Astro layouts
│   ├── pages/           # Astro pages (routes)
│   │   ├── api/               # API routes for Notion integration
│   │   ├── index.astro        # Main page
│   │   └── zoo.astro          # Component showcase
│   ├── services/        # Business logic services
│   ├── store/           # State management (Nanostores)
│   │   ├── AppStore/          # Application state
│   │   ├── LocaleStore/       # Language preferences
│   │   └── ThemeStore/        # Theme management
│   ├── styles/          # Global styles and themes
│   │   └── themes/            # Theme definitions (Windows 95, etc.)
│   └── types/           # TypeScript type definitions
├── astro.config.mjs     # Astro configuration
├── tsconfig.json        # TypeScript configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Project dependencies and scripts
```

---

## API Routes

The project includes several API endpoints for Notion integration:

- `/api/notion/page` - Fetch main pages
- `/api/notion/page/[pageId]` - Fetch specific page content
- `/api/notion/database/[databaseId]` - Query Notion databases
- `/api/notion/datasource/[dataSourceId]` - Fetch data source information
- `/api/notion/datasource/[dataSourceId]/query` - Query data sources with filters
- `/api/notion/apps` - Fetch application configurations
- `/api/notion/block/[blockId]` - Fetch block data
- `/api/notion/block/[blockId]/children` - Fetch block children

---

## Configuration

### Astro Configuration ([astro.config.mjs](astro.config.mjs))

- **Adapter**: Node.js standalone mode for SSR
- **Integrations**: Preact for reactive components
- **Environment Variables**: Secure Notion token handling via `astro:env/server`

### TypeScript Configuration ([tsconfig.json](tsconfig.json))

- Path aliases configured for clean imports:
  - `@/*` → `src/*`
  - `@components/*` → `src/components/*`
  - `@layouts/*` → `src/layouts/*`
  - `@pages/*` → `src/pages/*`
  - `@utils/*` → `src/utils/*`
  - `@styles/*` → `src/styles/*`
- Strict type checking enabled
- Astro-specific types included

### PostCSS Configuration ([postcss.config.js](postcss.config.js))

- `postcss-import` for CSS imports
- `@tailwindcss/postcss` for Tailwind processing
- `autoprefixer` for browser compatibility

---

## Scripts

- `npm run dev` - Start development server (with hot reload)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm start` - Run production Node.js server
- `npm run astro` - Run Astro CLI commands

---

## VS Code Integration

This project includes VS Code workspace settings in the [.vscode](.vscode) folder for an optimal development experience:

- Preconfigured debug settings for Astro development ([.vscode/launch.json](.vscode/launch.json))
- Recommended extensions ([.vscode/extensions.json](.vscode/extensions.json))
- Workspace-specific editor settings ([.vscode/settings.json](.vscode/settings.json))

Open the project in VS Code and accept the prompt to install recommended extensions.

---

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

---

## License

This project is open source and available under the [PortOS License](LICENSE.md).

---

## Acknowledgments

- win95 theme mande ontop of jdan's 98.css - [GitHub Repository](https://github.com/jdan/98.css)
- Notion API for dynamic content management
- DaisyUI for component styling
- The Astro and Preact communities

---

**Enjoy exploring portfolio-os!** 🖥️✨

If you have feedback or ideas for improvements, please open an issue or create a pull request. Happy coding!
