import api from "./axios";

export const getGameState = async () => {
  const res = await api.get("/game/state");
  return res.data;
};

export const claimTile = async (tileId: number, userId: string) => {
  await api.post("/play/claim", { tileId, userId });
};

