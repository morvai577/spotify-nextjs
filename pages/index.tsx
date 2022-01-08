import { GetServerSideProps } from "next";
import { Box, Text, Flex } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";
import GradientLayout from "../components/gradientLayout";
import prisma from "../lib/prisma";

const Home = ({ artists }) => {
  return (
    <GradientLayout
      roundImage
      color="yellow"
      subtitle="profile"
      title="Vai Mor"
      description="15 public playlists"
      image="https://media-exp1.licdn.com/dms/image/C5603AQHUnPNMt3bitA/profile-displayphoto-shrink_800_800/0/1577415249606?e=1646870400&v=beta&t=cHalC5gBOnVBoUxuaKJsz0sCqsYOK24hp7J9knGWDRU"
    >
      <Box color="white" paddingX="40px">
        <Box marginBottom="40px">
          <Text fontSize="2xl" fontWeight="bold">
            Top artist of this month
          </Text>
          <Text fontSize="md">only visible to you</Text>
        </Box>
        <Flex>
          {artists.map((artist) => (
            <Box paddingX="10px" width="20%">
              <Box bg="gray.900" borderRadius="4px" padding="15px" width="100%">
                <Image
                  src="https://placekitten.com/300/300"
                  borderRadius="100%"
                />
                <Box marginTop="20px">
                  <Text fontSize="large">{artist.name}</Text>
                  <Text fontSize="x-small">Artist</Text>
                </Box>
              </Box>
            </Box>
          ))}
        </Flex>
      </Box>
    </GradientLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const artists = await prisma.artist.findMany({});

  return {
    props: { artists },
  };
};

export default Home;
