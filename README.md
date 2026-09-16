# Léo Parpeix Portfolio Clone

An interactive 3D portfolio website recreation inspired by the work of [Léo Parpeix](https://leoparpeix.com) (French Art Director & Interactive Designer). This project combines modern creative web technologies including Three.js, custom GLSL shaders, GSAP animations, Lenis smooth scrolling, and Vue 3 with TypeScript.

---

## 🚀 Tech Stack & Libraries

- **Frontend Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (~5.7)
- **3D & WebGL Engine**: [Three.js](https://threejs.org/) (r174)
- **Shader Pipeline**: [GLSL](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language) via [`vite-plugin-glsl`](https://github.com/UstymUkhman/vite-plugin-glsl)
- **Animations**: [GSAP](https://greensock.com/gsap/) (GreenSock Animation Platform)
- **Smooth Scrolling**: [Lenis](https://github.com/darkroomengineering/lenis)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Runtime / Package Manager**: [Bun](https://bun.sh/) (recommended) or [Node.js](https://nodejs.org/) (npm/pnpm/yarn)

---

## ✨ Features

- **Interactive 3D WebGL Canvas**: Multi-layered Three.js scene architecture (`HomeScene`, `AboutScene`, and `TopScene` overlay) with dynamic model rendering.
- **Custom Shaders & Effects**: Real-time fluid simulation, water deformation, and custom post-processing pipelines.
- **Micro-Interactions & Custom Cursor**: Dynamic fluid cursor physics responsive to mouse velocity and device capabilities (`hover: hover` detection).
- **Smooth Audio Experience**: Audio controller handling spatial and responsive sound effects (transitions, ambient loops, interactive audio triggers).
- **Responsive Layout**: Designed for responsive layouts with smooth page transitions and customized Lenis scroll dampening.

---

## 📁 Project Structure

```text
leoparpeix/
├── public/                 # Static assets (favicons, fonts, manifest)
│   ├── assets/             # 3D models (.glb), textures, audio (.aac), media
│   └── draco/              # Draco compression decoders for Three.js GLTFLoader
├── scripts/                # Asset management and utility scripts
│   ├── download-assets.ts  # Script to download essential 3D assets, audio, and media
│   └── retry-missing.ts    # Sequential retry script for missing assets
├── src/
│   ├── components/         # Reusable Vue components
│   │   ├── CursorIndication.vue # Custom interactive cursor
│   │   ├── FooterBlock.vue      # Footer component
│   │   ├── LoaderBlock.vue      # Initial page loading screen
│   │   ├── NavbarComponent.vue  # Main navigation header
│   │   ├── ProjectSlider.vue    # Interactive project showcase slider
│   │   └── VideoPlayer.vue      # Video lightbox player
│   ├── data/               # Static site content and project metadata
│   │   └── siteContent.ts
│   ├── router/             # Vue Router route definitions
│   ├── services/           # Application-level services
│   │   ├── EventBus.ts          # Event bus for decoupled communication
│   │   ├── SmoothScroll.ts      # Lenis smooth scroll manager
│   │   └── SoundController.ts   # Audio manager and trigger service
│   ├── stores/             # Pinia store definitions
│   │   └── appState.ts          # Global state (menu state, sound state, etc.)
│   ├── styles/             # Global CSS and design tokens
│   │   └── main.css
│   ├── views/              # Page view components
│   │   ├── AboutView.vue
│   │   ├── HomeView.vue
│   │   └── PlaygroundView.vue
│   ├── webgl/              # Three.js & WebGL architecture
│   │   ├── AboutScene.ts        # 3D scene for About page
│   │   ├── FluidSimulation.ts   # GPU fluid simulation shaders
│   │   ├── GLTFLoaderHelper.ts  # Draco-enabled GLTF model loader
│   │   ├── HomeScene.ts         # 3D scene for Home page
│   │   ├── PostProcessing.ts    # Fullscreen post-processing pipeline
│   │   ├── TopScene.ts          # Interactive 3D cursor/top elements scene
│   │   └── WebGLManager.ts      # WebGL render loop & lifecycle orchestrator
│   ├── App.vue             # Root Vue component
│   └── main.ts             # Application entrypoint
├── index.html              # HTML template & font preload definitions
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration & plugins
```

---

## 🛠️ Prerequisites

Before building the project, ensure you have the following installed on your machine:

- **Node.js**: Version `18.0.0` or higher (if using npm/yarn/pnpm)
- **Bun** (recommended): Version `1.0.0` or higher
- **Git**: For cloning the repository

---

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd leoparpeix
   ```

2. **Install dependencies**:
   ```bash
   # Using Bun (recommended)
   bun install

   # Or using npm
   npm install
   ```

---

## 📥 Downloading Project Assets

The project relies on external 3D models (`.glb`), audio clips, and textures. A download script is included to fetch these assets:

```bash
# Using Bun
bun run download-assets

# Or directly:
bun run scripts/download-assets.ts
```

If any specific media files fail due to network timeouts, run the retry script:
```bash
bun run scripts/retry-missing.ts
```

---

## 💻 Development & Build Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` / `bun run dev` | Starts the Vite development server with HMR at `http://localhost:5173` |
| `npm run build` / `bun run build` | Compiles TypeScript and builds the production bundle into `dist/` |
| `npm run preview` / `bun run preview` | Spawns a local static server to preview the production build |
| `npm run download-assets` | Executes the asset downloader script via Bun |

### Running the Development Server

To start the local development server:
```bash
npm run dev
# or
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### Building for Production

To create an optimized production build:
```bash
npm run build
# or
bun run build
```

The output artifacts will be written to the `dist/` directory:
- `dist/index.html`: Optimized HTML entry point
- `dist/assets/`: Minified JavaScript bundles, compiled CSS, and assets

### Previewing the Production Build

To test the generated production build locally:
```bash
npm run preview
# or
bun run preview
```

---

## ⚙️ Configuration Notes

- **Vite Aliases**: The `@` alias maps to `./src` (configured in `vite.config.ts` and `tsconfig.json`).
- **GLSL Shaders**: `.glsl`, `.vert`, `.frag` files can be imported directly into TypeScript files via `vite-plugin-glsl`.
- **Draco Compression**: Three.js `GLTFLoader` uses Draco decoder binaries located in `public/draco/`. Ensure this folder remains in `public/` when deploying.

---

## 🌐 Deployment

The output of `npm run build` in `dist/` can be deployed to any static site hosting service, including:
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [GitHub Pages](https://pages.github.com/)

> **Note**: Because this application is a Single Page Application (SPA) using HTML5 History Mode (`vue-router`), ensure your static host is configured to rewrite all routes to `/index.html`.

---

## 📄 License & Credits

- **Original Concept & Design**: [Léo Parpeix](https://leoparpeix.com)
- **Disclaimer**: This project is developed for educational and learning purposes. All original designs, visual concepts, and 3D assets belong to their respective creators.
