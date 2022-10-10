import { IGameModel } from "./gameModel";
import { IGameView } from "./gameView";
import { Cell } from "./types/Cell";

export interface IGameController {
  getField(): Cell[][];
  onCellClick(x: number, y: number): void;
  onActivationClick(): void;
  startAction(): void;
  stopAction(): void;
  newGame(): void;
  changeSize(width: number, height: number): void;
  getSpeed(): number;
  changeSpeed(speed: number): void;
  fillRandomly(): void;
}

export class GameController implements IGameController {
  gameView: IGameView;

  gameModel: IGameModel;

  speed: number;

  isActive = false;

  timerId: number | undefined;

  constructor(gameModel: IGameModel, gameView: IGameView, speed = 1) {
    this.gameModel = gameModel;
    this.gameView = gameView;
    this.speed = speed;

    this.gameView.initialize(this);
  }

  getField(): Cell[][] {
    return this.gameModel.getState();
  }

  onCellClick(x: number, y: number): void {
    this.gameModel.toggleCellState(x, y);
  }

  onActivationClick(): void {
    if (this.isActive) {
      this.stopAction();
    } else {
      this.startAction();
    }
  }

  startAction() {
    this.isActive = true;
    this.timerId = window.setInterval(() => {
      if (!this.gameModel.nextGeneration()) {
        this.stopAction();
        alert("Игра закончена");
        this.newGame();
      }
      const newState = this.gameModel.getState();
      this.gameView.updateField(newState);
    }, this.speed * 1000);
  }

  stopAction() {
    this.isActive = false;
    window.clearInterval(this.timerId);
  }

  newGame() {
    this.gameModel.clearField();
    const newState = this.gameModel.getState();
    this.gameView.updateField(newState);
    this.gameView.setButtonStart();
  }

  changeSize(width: number, height: number): void {
    this.gameModel.setSize(width, height);
    this.gameView.setSize(width, height);

    const newState = this.gameModel.getState();
    this.gameView.updateField(newState);
  }

  changeSpeed(speed: number): void {
    this.speed = speed;
    if (this.isActive) {
      this.stopAction();
      this.startAction();
    }
  }

  getSpeed(): number {
    return this.speed;
  }

  fillRandomly(): void {
    const field = this.getField();
    for (let row = 0; row < field.length; row++) {
      for (let col = 0; col < field[row].length; col++) {
        const isToogled = Math.random() > 0.5;
        if (isToogled) {
          this.gameModel.toggleCellState(col, row);
        }
      }
    }

    const newField = this.getField();
    this.gameView.updateField(newField);
  }
}
