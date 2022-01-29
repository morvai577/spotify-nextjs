# music-player-nextjs

A music full-stack serverless application built using Next.js. This project is purely for learning purposes, so that I can learn how to build a modern full-stack app from start to finish.

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

### Using Prisma in the project
This project uses Prisma in a serverless environment because Vercel's APIs are serverless and Prisma is not always running.

### Purpose of using a wrapper lib i.e. `fetcher.ts`
To abstract away the HTTP fetching mechanism, because the client side uses some hooks that requires some of these mechanisms. So in order to keep it simple, good to have an abstraction in between.

### Conditionally opt in/out of global layout component
The authentication pages do not require the layout component that contains all the other components of the app as it its children. So to opt out of it, do the following:

1) Add a unique property to the auth pages:
```tsx
...
Signin.authPage = true;

export default Signin;
```

2) Add conditional rendering to `_app.tsx`
```tsx
const MyApp = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      {Component.authPage ? (
        <Component {...pageProps} />
      ) : (
        <PlayerLayout>
          <Component {...pageProps} />
        </PlayerLayout>
      )}
    </ChakraProvider>
  );
};

export default MyApp;
```

### Playlist folder in pages directory
- This folder contains all pages to do with playlist.
- We are using this because each playlist in this app will have its own unique route e.g. ``. This will require dynamic routing.

### Dynamic routing
In Next.js you can add brackets to a page (`[param]`) to create a dynamic route (a.k.a. url slugs, pretty urls, and others).

Consider the following page:
```tsx
<NextLink
    href={{
      pathname: '/playlist/[id]',
      query: { id: playlist.id },
    }}
    passHref
>
```

Any route like `/playlist/1`, `/playlist/2`, etc. will be matched by `pages/playlist/[id].tsx`. The matched path parameter will be sent as a query parameter to the page, and it will be merged with the other query parameters.

For example, the route `/playlist/1` will have the following `query` object:
```json
{ "id": "1" }
```

### Server Side Rendering (SSR)
This option for data fetching allows Next.js to pre-render the page on each request using the data returned by `getServerSideProps`.

To decide whether to use this option, figure out whether the data changes often. If it does then this is a good option, otherwise if it doesn't then it is wasteful as you are making all those requests for no reason.

#### Example:
Fetch top played artist implementation, in  [this commit](https://github.com/morvai577/spotify-nextjs/blob/362709d4b064e8f863b4daaf8fe36a3af479aa91/pages/index.tsx)
1. Define new async function called `getServerSideProps` . Note: This function must always return something. This function is used to inject required props to the `Home` functional component.
2. Fetch data from prisma
3. Return prisma data as props object containing artists as its value.

[Documentation](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)

### Get current user
- First we need to add a method that gets the current user by verifying the current token.
- This method is defined in the `auth` library:
```ts
export const validateToken = (token) => {
  const user = jwt.verify(token, 'hello')
  return user
}
```

### Using map method to render the same UI for a collection
The following example demonstrates how to render table rows for each song in the collection

#### Example:
```tsx
{songs.map((song, i) => (
  /* For each song create a new table row */
  <Tr
    sx={{
      transition: "all .3s ",
      "&:hover": {
        bg: "rgba(255, 255, 255, 0.1)",
      },
    }}
    key={song.id}
    cursor="cursor"
  >
    <Td>{i + 1}</Td>
    <Td>{song.name}</Td>
    <Td>{song.createdAt.toString()}</Td>
    <Td>{song.duration}</Td>
  </Tr>
))}
```
### Managing global state on client side
The application contains this player UI at the bottom:

This particular UI element is present in all pages of the application. This player needs to be aware at all times what track is currently playing and what playlist it is playing the track from. So this requires a global state, one option is Redux but that will be overkill for this one particular use case of global state.


