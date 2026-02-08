import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BE_URL;

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  return socket;
};

export const getSocket = () => socket;
