import { useCallback, useEffect, useState } from "react";
import YouTube from "react-youtube";
import { YouTubePlayer } from "youtube-player/dist/types";
import { useStoreState, useStoreActions } from "../../store";

export function YoutubePlayer({
  onReady,
}: {
  onReady: (event: { target: YouTubePlayer }) => void;
}) {
  return (
    <YouTube
      containerClassName="yt-player"
      className="yt-player"
      videoId={""}
      opts={{
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          // autoplay: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
        },
      }}
      onReady={onReady}
      loading="lazy"
    />
  );
}

const VideoIDRegex =
  /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/;

export function getID(url: string | undefined) {
  return url?.match(VideoIDRegex)?.[2] || "";
}

export function usePlayer(player?: YouTubePlayer) {
  // const [status, setStatus] =
  //   useState<Partial<typeof INITIALSTATE>>(INITIALSTATE);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentVideo, setCurrentVideo] = useState("");
  const [playerVolume, setPlayerVolume] = useState(0);
  const volume = useStoreState((state) => state.player.volume);
  const setVolume = useStoreActions((action) => action.player.setVolume);
  const muted = useStoreState((state) => state.player.muted);
  const setMuted = useStoreActions((action) => action.player.setMuted);
  const [playerMuted, setPlayerMuted] = useState(false);
  const [state, setState] = useState(0);
  const [hasError, setError] = useState(false);
  const errorHandler = useCallback((e: any) => {
    console.warn("PLAYER ERROR ORCCURED", e);
    setError(true);
  }, []);

  useEffect(() => {
    if (player) {
      player.addEventListener("onError", errorHandler);
    }
    return () => {
      player?.removeEventListener("onError", errorHandler);
    };
  }, [errorHandler, player]);

  // Volume change event from embed
  useEffect(() => {
    setVolume(playerVolume);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerVolume]);

  // Mute event from embed
  useEffect(() => {
    setMuted(playerMuted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerMuted]);

  // Mute event from Musicdex
  useEffect(() => {
    muted ? player?.mute() : player?.unMute();
  }, [player, muted]);

  // Volume change event from Musicdex
  useEffect(() => {
    player?.setVolume(volume ?? 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  useEffect(() => {
    let timer: NodeJS.Timer | null = null;
    if (player) {
      timer = setInterval(async () => {
        if (player) {
          setCurrentTime(await player.getCurrentTime());
          setDuration(await player.getDuration());
          setCurrentVideo(getID(await player.getVideoUrl()));
          setState(await player.getPlayerState());
          setPlayerVolume(await player.getVolume());
          setPlayerMuted(await player.isMuted());
        }
      }, 333);
    }
    return () => {
      timer && clearInterval(timer);
    };
  }, [player]);

  return {
    muted,
    duration,
    currentTime,
    currentVideo,
    state,
    volume,
    setError,
    hasError,
  };
}
