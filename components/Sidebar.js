import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { PlaylistIdState } from "../atoms/playlistsAtom";

function Sidebar() {
  const { data: session, state } = useSession();

  const spotifyApi = useSpotify();
  const [playlistId, setPlaylistId] = useRecoilState(PlaylistIdState);

  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div
      className="  hidden
        sm:inline-flex sm:min-w-[12rem]  md:min-w-[15rem] scrollbar-hide overflow-y-scroll h-screen pb-32"
    >
      <div className="  flex-1 text-gray-500 p-5 text-sm border-r border-gray-900 space-y-3">
        <button className="flex items-center hover:text-white space-x-2 ">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center hover:text-white space-x-2 ">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center hover:text-white space-x-2 ">
          <LibraryIcon className="h-5 w-5" />
          <p>Your Library</p>
        </button>
        <hr />
        <button className="flex items-center hover:text-white space-x-2 ">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center hover:text-white space-x-2 ">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center hover:text-white space-x-2 ">
          <RssIcon className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr />
        {/* playlists render  */}
        {playlists.map((playlist) => (
          <p
            onClick={() => {
              setPlaylistId(playlist.id);
            }}
            key={playlist.id}
            className="cursor-pointer hover:text-white"
          >
            {playlist.name}
          </p>
        ))}

        <hr />
      </div>
    </div>
  );
}

export default Sidebar;
