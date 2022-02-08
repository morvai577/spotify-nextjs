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

## Authentication via JWT and cookies

### Get current user
- First we need to add a method that gets the current user by verifying the current token.
- This method is defined in the `auth` library:
```ts
export const validateToken = (token) => {
  const user = jwt.verify(token, 'hello')
  return user
}
```

### Redirect user if cannot be identified or if token has expired
```tsx
let user;

  try {
    // Try getting user via token (it may have expired)
    user = validateToken(validateToken(req.cookies.TRAX_ACCESS_TOKEN));
  } catch (e) {
    // If token expired or is not valid, redirect user to login
    return {
      redirect: {
        permanent: false,
        destination: "/signin",
      },
    };
  }
```
Notice we are returning a `redirect` object, this is provided by [NextJS](https://nextjs.org/docs/api-reference/next.config.js/redirectshttps://nextjs.org/docs/api-reference/next.config.js/redirects).

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

Instead, this project uses a lightweight version of Redux, called [Easy Peasy](https://easy-peasy.vercel.app).

All state management code can be seen in `\lib\store.ts` file

States we want to keep track off:

    1. activeSongs (an array)
    2. activeSong

Actions we need:

    1. Change active songs
    2. Change active song

You will see in the store method, the following:
```ts
state.activeSongs = payload;
```
This is an example of an [immer](https://github.com/immerjs/immer) operation, which allows you to write code as above, but under the hood converts the operation into an immutable update.

In order to use this store for managing global state for your app (`_app.tsx`), you need to first wrap the full app under `StoreProvider` and pass a prop that points to the store created above:
```tsx
const MyApp = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <StoreProvider store={store}>
          ...
```

#### Example use of global state: Adding songs to `activeSongs`
When a user clicks big play button in a playlist, we want to add all the songs in the playlist to `activeSongs`, so we want to send these songs to the store. This is done in the songsTable

Then we can retrieve this global state in our `player` component to get this data.

#### Example 2 use of global state: Play a song from a playlist
When a user clicks on a song in a playlist, we want to play  it, add it to `activeSongs`, so we want to send this song and its playlist to the store. This is done in the songsTable.

Then we can retrieve this global state in our `player` component to get this data.

### How the applications actually plays music

This is abstracted and handled by [react-howler](https://khoanguyen.me/react-howler/).

## Create a reference to native JS howler instance

TODO: Why do we want to do this?

To do this, we:

* Create object reference via `useRef` hook, provided by React.
* Set default value to `null`.
* Attach it to React howler via `ref` prop.

## Implementing functionality for player buttons and same time updating the UI

### Next/Previous track buttons

When a user clicks on the next or previous track buttons, we want to play the next or previous track. We have already implemented the UI in the `player` component. The remaining aspect is the functionality.

To achieve this, callbacks have been defined and bound to the buttons:

* `prevSong`
  * Callback to play the previous song.
  * One thing to make sure here is that when updating the track, we need to make sure the index of the current is set to the last song in the songs array if the current song is the first song in the array.
  * If not, then we just decrement the index and set it to the previous track in the array.


* `nextSong`
  * Callback to play the next song.
  * One thing to make sure here is that when updating the track, we need to check first if shuffle is enabled. If so, then we want to set the index to a random number between 0 and the length of the songs array. If not, then we just increment the index and set it to the next track in the array.
  * Also, have to make sure when randomly setting the index that it is not the same as the current song. If it is, then we need to use recursion to re-call the callback until it is not the same as the current song's index.

### When current song finishes playing

#### Functionality
When a song finishes playing, we want to play the next song. This is achieved using the `onEnd` callback. One thing to note is, this function:

  * If repeat is on, the function sets the seek to 0.
  * If repeat is off, the function will call `nextSong` to play the next song.

#### UI
When a song finishes playing, we want to update the UI to reflect the new song. This is achieved via:

  * `setSeek(0)` to 0.

### Show duration of current track

#### Functionality
Added `onLoad` callback that gets duration of current track using howler.

#### UI
Update UI using `setDuration`.

### Seek track

#### Functionality
Howler's current seek method.  

#### UI
When a user clicks on the seek bar, we want to update the seek position of the track. This is achieved using the `onSeek` callback.

### Making track progress bar functional

  * Set `max` prop to length of track via: `max={duration ? duration.toFixed(2) : 0}`.
  * Need to add new state to track whether user is currently seeking via `isSeeking`.
    * `onChangeStart` callback to set `isSeeking` to `true`, i.e. started seeking.
    * `onChangeEnd` callback to set `isSeeking` to `false` , i.e. finished seeking.

## Update UI when changing songs or current song continues to play

**Strategy used**: Have a watcher that monitors a certain value, and then on some interval, re-render. This strategy has been implemented using [request animation frame](https://www.pluralsight.com/guides/how-to-use-requestanimationframe-with-react).

We only want this strategy to update the UI when:

* Music is currently playing.
* User is not currently seeking.

### Implementation

  * Use the `useEffect` hook to do the watching.
    * Takes a callback with two parameters to monitor `playing` and `isSeeking` states.
    * `requestAnimation` returns a `timeId` you can you use to cancel watching later on.
    * If playing and not seeking, then create a function `f`  that calls `setSeek` to set its value to current position of progress of the song (binding). This will ensure progress bar of current playing track is constantly updated with the interval.
    * If not playing or seeking, then cancel the UI update.

## Set active song (current song) using an index and easy-peasy

A change in index, will trigger a state change through easy-peasy (see `setActiveSong`) and in return re-render the `player` component with the new active song.

A song changes:

* On end
* On previous
* On next

To monitor when the song changes i.e. the index changes, `useEffect` has been used in the implementation, to update the active song.

## Deployment

Project has been deployed to vercel. The default build command needs to be overriden with the following instead:
`npx prisma generate && npx prisma migrate deploy && next build`.

Need to also pass in database connection strings via environmental variables.

Tips:

* [Ignore ESLint errors](https://nextjs.org/docs/api-reference/next.config.js/ignoring-eslint)
* [Ignore TS errors](https://nextjs.org/docs/api-reference/next.config.js/ignoring-typescript-errors)
