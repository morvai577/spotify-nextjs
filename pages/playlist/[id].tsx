import { validateToken } from "../../lib/auth";
import prisma from "../../lib/prisma";
import GradientLayout from "../../components/gradientLayout";
import SongsTable from "../../components/songsTable";

// This method is a random colour generator to generate a unique gradient colour for each playlist
const getBGColour = (id) => {
  const colours = [
    "red",
    "green",
    "blue",
    "orange",
    "purple",
    "gray",
    "teal",
    "yellow",
  ];

  return colours[id - 1] || colours[Math.floor(Math.random() * colours.length)];
};

const Playlist = ({ playlist }) => {
  const colour = getBGColour(playlist.id);

  return (
    <GradientLayout
      colour={colour}
      roundImage={false}
      title={playlist.name}
      subtitle="playlist"
      description={`${playlist.songs.length} songs`}
      image={`https://picsum.photos/400?random=${playlist.id}`}
    >
      <SongsTable songs={playlist.songs} />
    </GradientLayout>
  );
};

export const getServerSideProps = async ({ query, req }) => {
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

  const [playlist] = await prisma.playlist.findMany({
    where: {
      // Add + below to convert query string to a number
      id: +query.id,
      userId: user.id,
    },
    // include means the same thing as a join
    include: {
      songs: {
        include: {
          artist: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });

  return {
    props: { playlist },
  };
};
export default Playlist;
