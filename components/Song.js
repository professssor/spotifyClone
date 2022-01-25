import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistDataState } from "../atoms/playlistsAtom";
import {
  currentTrackIdState,
  isPlayingState,
  songTimeState,
} from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";

function Song({ order, track }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsplaying] = useRecoilState(isPlayingState);
  const [playlistSongData, setPlaylistSongData] = useRecoilState(songTimeState);

  // lyric generating function

  // ######################################

  const playSong = () => {
    setCurrentTrackId(track.track.id);
    setIsplaying(true);
    setPlaylistSongData(track.track);

    spotifyApi.play({
      uris: [track.track.uri],
    });
  };

  return (
    <div
      onClick={playSong}
      className="grid grid-cols-2 text-gray-600 text-md px-5 py-4 hover:bg-gray-900 hover:rounded-md cursor-pointer transition-all"
    >
      <div className="flex  items-center space-x-8 ">
        <p>{order + 1}</p>
        <img
          className="w-12 h-12 rounded-sm"
          src={track.track.album.images[0]?.url}
          alt=""
        />
        <div className="">
          <p className="  w-36 lg:w-64 truncate text-white ">
            {track.track.name}
          </p>
          <p className="w-40 truncate ">{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className="  flex items-start justify-between ml-auto md:ml-0">
        <p className=" w-40 hidden md:inline pl-3 lg:pl-0  ">
          {track.track.album.name}
        </p>
        <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
