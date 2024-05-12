import React from "react";
import { Platform } from "react-native";
import io, { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../types/socket.types";

console.log("Emulation OS Platform: ", Platform.OS);
// Also usable : "http://10.0.2.2:3000"
export const socketEndpoint =
  Platform.OS === "web" ? "http://localhost:3000" : "http://192.168.0.25:3000";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  socketEndpoint,
  {
    transports: ["websocket"],
  }
);

export let hasConnection = false;

socket.on("connect", () => {
  console.log("connect: ", socket.id);
  hasConnection = true;
});

socket.on("disconnect", () => {
  hasConnection = false;
  console.log("disconnected from server"); // undefined
  socket.removeAllListeners();
});

export const SocketContext = React.createContext<Socket<
  ServerToClientEvents,
  ClientToServerEvents
> | null>(null);
