import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentTrackIdState,
  isPlayingState,
  songInfoState,
  songTimeState,
} from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import Song from "./Song";
import {
  SwitchHorizontalIcon,
  RewindIcon,
  PauseIcon,
  PlayIcon,
  FastForwardIcon,
  ReplyIcon,
  VolumeUpIcon,
  VolumeOffIcon,
} from "@heroicons/react/outline";
import { debounce, values } from "lodash";
import { playlistDataState, PlaylistIdState } from "../atoms/playlistsAtom";
import { millisToMinutesAndSeconds } from "../lib/time";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const [isPlaying, setIsplaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const songInfo = useSongInfo();
  const [value, setValue] = useState(false);
  const [duration, setDuration] = useState(null);
  // gives info about the song taken from url
  const [songData, setSongData] = useRecoilState(songInfoState);
  // song duration of track from url
  const urlMusicDuration = millisToMinutesAndSeconds(songData?.duration_ms);

  // gives information about track from playlist we have
  const tracktimeValue = useRecoilValue(songTimeState);
  // song duration of track from playlistDataState(user)

  const apnaTime = millisToMinutesAndSeconds(tracktimeValue?.duration_ms);
  // method to set song duration accordingly
  useEffect(() => {
    if (songData) {
      setDuration(millisToMinutesAndSeconds(songData?.duration_ms));
    } else {
      setDuration(apnaTime);
    }
  }, [session, songData, tracktimeValue]);

  // // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("NOW Playing", data.body?.item);
        setCurrentTrackId(data?.body?.item?.id);
      });
      spotifyApi
        .getMyCurrentPlaybackState()
        .then((data) => setIsplaying(data.body?.is_playing));
    }
  };

  // function to enable play pause functionality
  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data?.body.is_playing) {
        spotifyApi.pause();

        setIsplaying(false);
      } else {
        spotifyApi.play();
        setIsplaying(true);
      }
    });
  };

  // function  for shuffle
  const shuffleCheck = () => {
    if (!value) {
      spotifyApi.setShuffle(true);
      setValue(true);
    } else {
      spotifyApi.setShuffle(false);
      setValue(false);
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [session, spotifyApi, currentTrackIdState]);

  // use efffect for volume contol and change
  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {
        throw err;
      });
    }, 500),
    []
  );

  return (
    <div className="  h-24 bg-gradient-to-b from-black to-gray-900 text-white text-sm md:text-base grid grid-cols-3 px-2 md:px-8">
      <div className="truncate flex items-center space-x-3">
        <img
          className="hidden md:inline w-10 h-10"
          src={songInfo?.album?.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p className=" text-gray-300 font-light">
            {songInfo?.artists?.[0].name}
          </p>
        </div>
      </div>

      {/* center */}
      <div className="flex flex-col justify-center items-stretch  ">
        <div className="flex items-center  justify-evenly">
          {value ? (
            <SwitchHorizontalIcon
              onClick={shuffleCheck}
              className="button text-green-400"
            />
          ) : (
            <SwitchHorizontalIcon onClick={shuffleCheck} className="button" />
          )}

          <RewindIcon
            onClick={() => {
              spotifyApi.skipToPrevious();
            }}
            className="button"
          />
          {isPlaying ? (
            <PauseIcon
              onClick={handlePlayPause}
              className=" button w-10 h-10"
            />
          ) : (
            <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
          )}
          <FastForwardIcon
            onClick={() => spotifyApi.skipToNext()}
            className="button "
          />
          <ReplyIcon className="button" />
        </div>

        <div className=" hidden text-xs tex pt-1 space-x-2 md:flex items-center justify-center self-center">
          <span className="">0:00</span>
          <input
            className=" rangeButton h-[3px]  "
            type="range"
            name="musicTimeRange"
            id=""
            onChange={(e) => {
              e.preventDefault();
            }}
          />
          <span>{duration}</span>
        </div>
      </div>
      {/* right */}
      <div className="flex items-center space-x-2 md:space-x-4 justify-end pr-5">
        <VolumeOffIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          name="Volumerange"
          min={0}
          max={100}
          onChange={(e) => {
            setVolume(Number(e.target.value));
          }}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  );
}
export default Player;
