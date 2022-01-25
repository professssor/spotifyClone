import { useRecoilValue } from "recoil";
import { playlistDataState } from "../atoms/playlistsAtom";
import Song from "./Song";

function Songs() {
  const playlistContent = useRecoilValue(playlistDataState);

  return (
    <div className="p-3 text-white">
      {playlistContent?.tracks.items.map((track, i) => (
        <Song key={track.track.id} track={track} order={i} />
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const res = await playlistDataState;
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default Songs;
