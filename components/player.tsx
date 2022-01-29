import React from "react";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import ReactHowler from "react-howler";
import {
  ButtonGroup,
  IconButton,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import {
  MdOutlinePauseCircleFilled,
  MdOutlinePlayCircle,
  MdOutlinePlayCircleFilled,
  MdRepeat,
  MdShuffle,
  MdSkipNext,
  MdSkipPrevious,
} from "react-icons/all";

const Player = () => {
  return (
    <Box>
      <Box>{/* <ReactHowler /> */}</Box>
      <Center color="gray.600">
        <ButtonGroup>
          <IconButton
            aria-label="shuffle"
            icon={<MdShuffle />}
            outline="none"
            variant="link"
            fontSize="24px"
          />
          <IconButton
            aria-label="skip"
            icon={<MdSkipPrevious />}
            outline="none"
            variant="link"
            fontSize="24px"
          />
          <IconButton
            aria-label="play"
            icon={<MdOutlinePlayCircleFilled />}
            outline="none"
            variant="link"
            fontSize="40px"
            color="white"
          />
          <IconButton
            aria-label="pause"
            icon={<MdOutlinePauseCircleFilled />}
            outline="none"
            variant="link"
            fontSize="40px"
            color="white"
          />
          <IconButton
            aria-label="next"
            icon={<MdSkipNext />}
            outline="none"
            variant="link"
            fontSize="24px"
          />
          <IconButton
            aria-label="repeat"
            icon={<MdRepeat />}
            outline="none"
            variant="link"
            fontSize="24px"
          />
        </ButtonGroup>
      </Center>

      <Box color="gray.600">
        <Flex justify="center" align="center">
          <Box width="10%">
            <Text fontSize="xs">1:21</Text>
          </Box>
          <Box width="80%">
            <RangeSlider
              aria-label={["min", "max"]}
              step={0.1}
              min={0}
              max={321}
              id="player-range"
            >
              <RangeSliderTrack bg="gray.800">
                <RangeSliderFilledTrack bg="gray.600" />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
            </RangeSlider>
          </Box>
          <Box width="10%" textAlign="right">
            <Text fontSize="xs">3:21</Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Player;
