export interface ServerToClientEvents {
  "game.start": (data: any) => any;
  "queue.added": (data: any) => any;
  "game.timer": (data: any) => any;
  "game.score": (data: any) => any;
  "game.grid.view-state": (data: any) => any;
  "game.deck.view-state": (data: any) => void;
}

export interface ClientToServerEvents {
  "queue.join": () => void;
  "queue.add": () => any;
  "game.grid.selected": (any) => void;
  "game.dices.lock": (data: any) => any;
  "game.dices.roll": () => void;
}

export interface InterServerEvents {}

export interface SocketData {}
