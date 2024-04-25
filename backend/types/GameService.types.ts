export type PlayerKey = "player:1" | "player:2";

export type DeckDice = {
  id: number;
  value: string;
  locked: boolean;
};

type AvailableChoice = { value: string; id: string };

interface Deck {
  dices: DeckDice[];
  rollsCounter: number;
  rollsMaximum: number;
}

interface Choices {
  isDefi: boolean;
  isSec: boolean;
  idSelectedChoice: null | number;
  availableChoices: AvailableChoice[];
}

export interface GridLine {
  viewContent: string;
  id: string;
  canBeChecked: boolean;
  owner: null | PlayerKey;
}

export interface GameState {
  currentTurn: PlayerKey;
  timer: number | null;
  player1Score: 0;
  player2Score: 0;
  choices?: Choices;
  deck?: Deck;
  grid?: GridLine[][];
}
