import { IGameModel } from "./gameModel";
import { IGameView } from "./gameView";
import { Cell } from "./types/Cell";

export interface IGameController {
  getField(): Cell[][];
  onCellClick(x: number, y: number): void;
}

export class GameController implements IGameController {
  gameView: IGameView;

  gameModel: IGameModel;

  constructor(gameModel: IGameModel, gameView: IGameView) {
    this.gameModel = gameModel;
    this.gameView = gameView;

    this.gameView.initialize(this);
  }

  getField(): Cell[][] {
    return this.gameModel.getState();
  }

  onCellClick(x: number, y: number): void {
    this.gameModel.toggleCellState(x, y);
  }
}
