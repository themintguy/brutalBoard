import { useEffect, useState } from "react";
import { getGameState, claimTile } from "./api/game.api";
import { joinUser } from "./api/user.api";
import Grid from "./components/Grid";
import { connectSocket } from "./config/socket"
import RoundTimer from "./components/RoundTimer";

type Tile = {
  id: number;
  claimedBy: string | null;
  color: string | null;
};

function App() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);


  useEffect(() => {
    const init = async () => {
      const user = await joinUser();
      setUserId(user.id);

      const game = await getGameState();
      setTiles(game.tiles);

      const socket = connectSocket();

      socket.on("tile-claimed", (data) => {
        setTiles((prev) =>
          prev.map((tile) =>
            tile.id === data.tileId
              ? { ...tile, claimedBy: data.userId, color: data.color }
              : tile,
          ),
        );
      });

      socket.on("round-ended", () => {
        getGameState().then((game) => {
          setTiles(game.tiles);
        });
      });

    };

    init();
  }, []);

  const handleTileClick = async (tileId: number) => {
    if (!userId) return;

    try {
      await claimTile(tileId, userId);
    } catch {
      console.log("Tile already claimed");
    }
  };

  if (!userId) return <p>Joining game…</p>;

 return (
   <div style={{ padding: 20 }}>
     <RoundTimer remainingMs={remainingMs} />
     <Grid tiles={tiles} onTileClick={handleTileClick} />
   </div>
 );

}

export default App;
