## spotify-nextjs

A spotify client built using Next.js. This project is purely for learning purposes, so that I can learn how to build a modern full-stack app from start to finish.

## Getting Started

### Running dev server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Design Decisions

### 100vw width and 100 vh height
This means our app will take up the full screen and no scrolling will be required for our app.

### Absolute positioning
This app uses absolute positioning and to achieve responsiveness. You will need to create a mobile and a desktop component for each view. This technique of creating responsive apps is used when you don't want to write too much CSS. The mobile or desktop component will be toggled based on a media query hook.