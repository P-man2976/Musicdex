import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  HStack,
  IconButton,
  StackProps,
} from "@chakra-ui/react";
import React from "react";
import { FiVolume1, FiVolume2, FiVolumeX } from "react-icons/fi";
import { useStoreActions, useStoreState } from "../../../store";
import { PlaybackButton } from "./PlaybackControl";

interface VolumeSliderProps {
  volume: number;
  onChange: (e: number) => void;
}

export const VolumeSlider = React.memo(({ ...rest }: StackProps) => {
  const volume = useStoreState((state) => state.player.volume);
  const setVolume = useStoreActions((action) => action.player.setVolume);
  const muted = useStoreState((state) => state.player.muted);
  const setMuted = useStoreActions((action) => action.player.setMuted);

  return (
    <HStack direction="row" alignItems="center" w="100%" gap={2} {...rest}>
      <PlaybackButton
        aria-label="Toggle muted"
        icon={
          muted ? <FiVolumeX /> : volume < 50 ? <FiVolume1 /> : <FiVolume2 />
        }
        onClick={() => {
          setMuted(!muted);
        }}
      />
      <Slider
        aria-label="slider-ex-4"
        value={muted ? 0 : volume}
        onChange={(val) => {
          if (val === 0) {
            setMuted(true);
          } else {
            setMuted(false);
            setVolume(val);
          }
        }}
        focusThumbOnChange={false}
      >
        <SliderTrack bg="gray.700">
          <SliderFilledTrack
            background={`linear-gradient(to right, var(--chakra-colors-brand-300), var(--chakra-colors-n2-300) 90%)`}
          />
        </SliderTrack>
        <SliderThumb boxSize={4} />
      </Slider>
    </HStack>
  );
});
