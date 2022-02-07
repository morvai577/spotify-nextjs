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
  const { id } = validateToken(req.cookies.TRAX_ACCESS_TOKEN);
  const [playlist] = await prisma.playlist.findMany({
    where: {
      id: +query.id,
      userId: id,
    },
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
