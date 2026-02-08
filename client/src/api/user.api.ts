import api from "./axios";

export const joinUser = async () => {
  const res = await api.post("users/join", {
    name: "Player",
  });
  return res.data;
};
