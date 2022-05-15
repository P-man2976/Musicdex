import { useHotkeys } from "react-hotkeys-hook";
import { useDisclosure } from "@chakra-ui/react";
import { useStoreState, useStoreActions } from "../store";
import { useSongQueuer } from "./SongQueuerHook";
import { PlaylistCreateModal } from "../components/playlist/PlaylistCreateForm";

type HotkeysAction = "addToQueue" | "addToPlaylist" | "playPlaylist";
interface HotkeysProps {
  actions: HotkeysAction[];
  songs?: Song[];
  playlist?: PlaylistFull;
}

export const useHotkeysControl = (
  { actions, songs, playlist }: HotkeysProps,
  deps?: any[]
) => {
  const { onOpen, ...modalProps } = useDisclosure();

  const queueSongs = useSongQueuer();
  const currentSong = useStoreState(
    (state) => state.playback.currentlyPlaying.song
  );
  const setPlaylist = useStoreActions((action) => action.playback.setPlaylist);
  const showAddDialog = useStoreActions(
    (action) => action.playlist.showPlaylistAddDialog
  );

  return useHotkeys(
    "p, q, space",
    (e, handler) => {
      e.preventDefault();
      switch (handler.key) {
        case "q":
          if (actions.includes("addToQueue") && songs && songs.length > 0) {
            queueSongs({ songs: songs, immediatelyPlay: false });
          }
          break;
        case "p":
          if (actions.includes("addToPlaylist") && songs && songs.length > 0) {
            showAddDialog(songs);
          }
          break;
        case "space":
          if (actions.includes("playPlaylist") && playlist) {
            if (!currentSong) {
              setPlaylist({ playlist });
            }
          }
          break;
      }
    },
    [queueSongs, currentSong, ...(deps || [])]
  );
};
