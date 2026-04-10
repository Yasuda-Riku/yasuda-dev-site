# yasuda-dev.com

Personal portfolio site. Static HTML/CSS/JS — no build step, no frameworks, no npm.

**Live:** https://yasuda-dev.com/

## Structure

```
.
├── index.html           # Top page (Hero, Selected, About, Contact)
├── apps/index.html      # App support hub
├── 404.html             # Error page
├── style.css            # All styles (design tokens + components)
├── main.js              # Scroll reveal (IntersectionObserver, ~20 lines)
├── favicon.svg          # "y" monogram
├── apple-touch-icon.png # 180×180
├── og.png               # OGP image 1200×630
├── robots.txt
├── sitemap.xml
└── docs/
    └── design-plan.md   # Design plan v3
```

## Local preview

Open `index.html` in a browser. No server required.

For live reload, use VS Code Live Server extension.

## Deploy

Push to `main` → Cloudflare auto-deploys. No build command, output directory is repo root.

## Design

Editorial Minimalism. Fraunces + Inter + JetBrains Mono. Warm off-white `#FAFAF7` with vermillion `#FF5A1F` accent.

Full design plan: [docs/design-plan.md](docs/design-plan.md)
