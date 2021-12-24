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

### Setting height of sidebar based on player height
The player height is 100px and we want to account for this when we want our sidebar to be full height but not overlap the other component. This is done using `calc`

```tsx
const Sidebar = () => {
  return (
    <Box
      width="100%"
      height="calc(100vh -100px)"
      bg="black"
      paddingX="5px"
      color="gray"
    />
  );
};
```

### Image optimisation using next/image
TODO

### Re-usable data
If you find yourself having to repeat certain values used for rendering or if you are working on a project that will have other devs too, put such information in a data array. For example:
```tsx
const navMenu = [
  {
    name: "Home",
    icon: MdHome,
    route: "/",
  },
  {
    name: "Search",
    icon: MdSearch,
    route: "/search",
  },
  {
    name: "Your Library",
    icon: MdLibraryMusic,
    route: "/library",
  },
];
```
To render this data, you just iterate over it.
```tsx
<List spacing={2}>
    {navMenu.map((menu) => (
      <ListItem paddingX="20px" fontSize="16px" key={menu.name}>
        <LinkBox>
          <NextLink href={menu.route} passHref>
            <LinkOverlay>
              <ListIcon
                as={menu.icon}
                color="white"
                marginRight="20px"
              />
              {menu.name}
            </LinkOverlay>
          </NextLink>
        </LinkBox>
      </ListItem>
    ))}
</List>
```

### Enabling client-side routing
We don't want the server to do the routing when clicking on links as this will cause the music to stop playing. So instead we want to do it on the client side.
```tsx
import NextLink from "next/link";
...
<NextLink href={menu.route} passHref>
    <LinkOverlay>
      <ListIcon
        as={menu.icon}
        color="white"
        marginRight="20px"
      />
      {menu.name}
    </LinkOverlay>
</NextLink>
```