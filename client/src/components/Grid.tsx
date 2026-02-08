import "../styles/modules/grid.css";

type Tile = {
  id: number;
  claimedBy: string | null;
  color: string | null;
};

type Props = {
  tiles: Tile[];
  onTileClick: (tileId: number) => void;
};

export default function Grid({ tiles, onTileClick }: Props) {
  return (
    <div className="grid">
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className={`tile ${tile.claimedBy ? "claimed" : ""}`}
          style={{ background: tile.color || "#eee" }}
          onClick={() => {
            if (!tile.claimedBy) onTileClick(tile.id);
          }}
        />
      ))}
    </div>
  );
}