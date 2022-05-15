import { action, Action, computed, Computed } from "easy-peasy";
import { StoreModel } from ".";
import { SelectedPosition } from "./settings";

type PlayerPosition = SelectedPosition | "full-player";
export interface PlayerModel {
  showUpcomingOverlay: boolean;
  setShowUpcomingOverlay: Action<PlayerModel, boolean>;
  overridePosition: PlayerPosition | undefined;
  setOverridePosition: Action<PlayerModel, PlayerPosition | undefined>;
  fullPlayer: boolean;
  setFullPlayer: Action<PlayerModel, boolean>;
  volume: number;
  setVolume: Action<PlayerModel, number>;
  endVolume: number | undefined;
  setEndVolume: Action<PlayerModel, number>;
  muted: boolean;
  setMuted: Action<PlayerModel, boolean>;

  position: Computed<PlayerModel, PlayerPosition, StoreModel>;
}

const playerModel: PlayerModel = {
  showUpcomingOverlay: false,
  setShowUpcomingOverlay: action((state, val) => {
    state.showUpcomingOverlay = val;
  }),

  overridePosition: undefined,
  setOverridePosition: action((state, val) => {
    state.overridePosition = val;
  }),

  fullPlayer: false,
  setFullPlayer: action((state, val) => {
    state.fullPlayer = val;
  }),

  volume: 100,
  setVolume: action((state, val) => {
    state.volume = val;
  }),

  endVolume: undefined,
  setEndVolume: action((state, val) => {
    state.endVolume = val;
  }),

  muted: false,
  setMuted: action((state, val) => {
    state.muted = val;
  }),

  position: computed(
    [
      (state) => state.overridePosition,
      (_state, storeState) => storeState.settings.selectedPosition,
    ],
    (override, selected) => override ?? selected
  ),
};

export default playerModel;
