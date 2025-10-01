# TEDxPUP Website (Frontend)

A modern, responsive frontend for the TEDxPUP event website. This site presents event highlights, featured speakers, schedule, ticket information, and more using a clean, accessible design with performant, vanilla web technologies.

## Live Demo

https://deploy-preview-13--grand-cajeta-bd7a46.netlify.app/

## Tech Stack

- **HTML5**: Semantic structure via `index.html`.
- **CSS3**: Modular styles under `css/` (base, layout, components, utilities) with responsive breakpoints and animations.
- **Vanilla JavaScript (ES Modules)**: Feature modules under `js/modules/` and utilities under `js/utils/`.
- **Static Assets**: Images and fonts under `assets/images/` and `assets/fonts/`.

## Features

- **Hero section** with animations
- **Dynamic speakers** rendering from `assets/data/speakers.json`
- **Schedule view** powered by `assets/data/schedule.json`
- **Countdown timer** to event day
- **Responsive navigation** and sections
- **Modal and ID/theming utilities**

## Project Structure

```
c:\frontend-tedxpup-s3\
  assets\
    data\
      event-info.json
      schedule.json
      speakers.json
    fonts\
    images\
  css\
    base\  components\  layout\  utilities\
    main.css
  js\
    modules\  utils\
    main.js
  index.html
  README.md
```

## Getting Started (Local Development)

No build step is required. Any static server will work. Choose one of the options below.

1) Using VS Code Live Server extension
- Install the "Live Server" extension
- Open the project folder
- Right–click `index.html` → "Open with Live Server"

2) Using a lightweight HTTP server (Node.js)

```bash
npx serve .
# or specify a port
npx serve -l 5173 .
```

3) Using Python (3.x)

```bash
python -m http.server 8000
```

Then visit:

- `http://localhost:3000`, `http://localhost:5173`, or `http://localhost:8000` depending on your chosen server.

## Development Notes

- Entry HTML: `index.html`
- Global CSS: `css/main.css` plus modular styles in `css/base`, `css/layout`, `css/components`, `css/utilities`
- JavaScript entry: `js/main.js`
- Feature modules: `js/modules/` (e.g., `speakers.js`, `schedule.js`, `hero.js`, `countdown.js`)
- Utilities: `js/utils/` (e.g., `dom.js`, `helpers.js`)
- Data: `assets/data/`
- Images/Fonts: `assets/images/`, `assets/fonts/`

## Deployment

This is a static site. You can deploy with any static host:

- **GitHub Pages**: Push to `main` and serve from `/` or `/docs`.
- **Netlify/Vercel**: Point to the repo; build command not required; publish directory is the project root.
- **Amazon S3 + CloudFront**: Upload files to an S3 bucket configured for static hosting and (optionally) put CloudFront in front for CDN.

After deployment, update the Live Demo URL above.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
