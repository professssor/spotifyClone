import {
  ChevronDownIcon,
  EmojiSadIcon,
  RssIcon,
} from "@heroicons/react/outline";
import { shuffle } from "lodash";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { PlaylistIdState, playlistDataState } from "../atoms/playlistsAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

function Center() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();

  const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-purple-500",
    "from-pink-500",
    "from-orange-500",
    "from-gray-500",
  ];
  const [color, setColor] = useState();
  const playlistId = useRecoilValue(PlaylistIdState);
  const [playlistContent, setPlaylistContent] =
    useRecoilState(playlistDataState);

  // function to change gradient color on clicking playlist name in sidebar
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  // function to fetch playlist data to render in center component
  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylistContent(data.body);
      })
      .catch((err) => console.log("error  fetching playlist data", err));
  }, [playlistId, spotifyApi]);
  //

  return (
    <div className="flex-grow relative h-screen overflow-y-scroll scrollbar-hide  ">
      <div onClick={() => signOut()} className=" absolute  h-40 w-full">
        <header className=" relative inline-block   top-5 left-[50%] translate-x-[-50%] md:relative md:left-[80%] md:pr-10 lg:left-[90%] lg:pr-16 ">
          <div className="flex items-center space-x-2 rounded-full  bg-transparent border-2   border-opacity-30 opacity-90 hover:opacity-80 cursor-pointer p-1 pr-2   ">
            <img
              className="  rounded-full h-10 w-10 "
              src={session?.user?.image}
              alt=""
            />
            <h6 className=" hover:text-white text-gray-300">
              {session?.user?.name.toLocaleLowerCase()}
            </h6>
            <ChevronDownIcon className="h-3 w-3 text-white" />
          </div>
        </header>
      </div>

      <section
        className={`flex items-end space-x-7  bg-gradient-to-b to-black ${color} h-96  text-white padding-8  `}
      >
        <div className="p-2 mb-10 ml-[50%] translate-x-[-50%]  flex flex-col justify-center items-center md:absolute md:ml-0   md:left-11  md:translate-x-[0]  md:mb-4">
          <img
            className="rounded-md   my-2 w-32 h-32 xl:h-40 xl:w-40   "
            src={playlistContent?.images?.[0]?.url}
            alt=""
          />
          <h1 className="md:hidden">
            <strong> {playlistContent?.name}</strong>
          </h1>
          <p className="  my-3 flex items-center space-x-1">
            <RssIcon className="h-4 w-4" />
            <span className=" text-gray-400 font-thin">followed by: </span>{" "}
            <span className="animate-pulse">
              {" "}
              {`  ${playlistContent?.followers?.total} `}
            </span>
          </p>
        </div>
        {/* trick to render the playlist title without breaking the layout */}
        <section className=" lg:left-72 md:relative md:left-64 md:bottom-24 lg:bottom-24 xl:left-72  ">
          <div className="  hidden md:inline-block  space-y-3  ">
            <h1 className="text-left text-3xl xl:text-5xl  ">
              <strong>{playlistContent?.name}</strong>
            </h1>
          </div>
          <div className=" hidden  md:block ">
            {playlistContent?.description ? (
              <p className="  text-left    text-sm xl:text-lg break-words font-normal text-gray-400  w-[50%]">
                {playlistContent?.description}{" "}
              </p>
            ) : (
              <p className="font-normal text-left  text-gray-400">
                No description available for this playlist..
              </p>
            )}
          </div>
        </section>
      </section>
      {/* songs rendering section */}
      <section>
        <Songs />
      </section>
    </div>
  );
}

export default Center;
