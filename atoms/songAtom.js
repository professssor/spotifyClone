import { atom } from "recoil";
export const currentTrackIdState = new atom({
  key: "currentTrackIdState",
  default: null,
});
export const isPlayingState = new atom({
  key: "isPlayingState",
  default: false,
});
export const songInfoState = new atom({
  key: "songInfoState",
  default: null,
});
export const songTimeState = new atom({
  key: "songTimeState",
  default: null,
});
