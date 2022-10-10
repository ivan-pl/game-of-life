import { Cell } from "./types/Cell";
import { IGameModel } from "./gameModel";
import { IGameView } from "./gameView";
import { GameController, IGameController } from "./gameController";

const randomNum = (): Cell => Number(Math.random() > 0.5) as Cell;
const sleep = (sleepDuration: number) =>
  new Promise((resolve) => setTimeout(resolve, sleepDuration));

window.alert = jest.fn();

describe("GameController", () => {
  let state: Cell[][];
  let gameView: IGameView;
  let gameModel: IGameModel;
  let gameController: IGameController;

  const getModel = jest.fn(
    (): IGameModel => ({
      getState: jest.fn(() => state),
      toggleCellState: jest.fn(),
      nextGeneration: jest.fn().mockReturnValue(true),
      setSize: jest.fn(),
      clearField: jest.fn(),
    })
  );

  const getView = jest.fn(
    (): IGameView => ({
      updateField: jest.fn(),
      setSize: jest.fn(),
      initialize: jest.fn(),
      onCellClick: jest.fn(),
      onActionClick: jest.fn(),
      setButtonStart: jest.fn(),
      onSetSizeClick: jest.fn(),
      onSpeedChange: jest.fn(),
      onFillRandomlyClick: jest.fn(),
      onClearClick: jest.fn(),
    })
  );

  beforeEach(() => {
    state = [
      [randomNum(), randomNum()],
      [randomNum(), randomNum()],
      [randomNum(), randomNum()],
      [randomNum(), randomNum()],
    ];
    gameView = getView();
    gameModel = getModel();
    gameController = new GameController(gameModel, gameView, 0.5);
  });

  it("is a class", () => {
    expect(GameController).toBeInstanceOf(Function);
    expect(new GameController(gameModel, gameView)).toBeInstanceOf(
      GameController
    );
  });

  it(".getField", () => {
    const field = gameController.getField();
    expect(field).toEqual(state);
  });

  it(".onCellClick", () => {
    const [x, y] = [1, 3];
    gameController.onCellClick(x, y);
    expect(gameModel.toggleCellState).toHaveBeenCalledWith(x, y);
  });

  it(".newGame", () => {
    gameController.newGame();
    expect(gameModel.clearField).toHaveBeenCalled();
    expect(gameView.updateField).toHaveBeenCalled();
    expect(gameView.setButtonStart).toHaveBeenCalled();
  });

  it(".startAction", async () => {
    gameController.startAction();
    await sleep(600);
    expect(gameModel.nextGeneration).toHaveBeenCalledTimes(1);
    expect(gameView.updateField).toHaveBeenCalledTimes(1);
    await sleep(600);
    expect(gameModel.nextGeneration).toHaveBeenCalledTimes(2);
    expect(gameView.updateField).toHaveBeenCalledTimes(2);
  });

  it(".stopAction", async () => {
    gameController.startAction();
    await sleep(600);
    expect(gameModel.nextGeneration).toHaveBeenCalledTimes(1);
    expect(gameView.updateField).toHaveBeenCalledTimes(1);
    gameController.stopAction();
    await sleep(600);
    expect(gameModel.nextGeneration).toHaveBeenCalledTimes(1);
    expect(gameView.updateField).toHaveBeenCalledTimes(1);
  });

  it("stops game if it's finished", async () => {
    jest.spyOn(gameController, "stopAction");
    jest.spyOn(gameController, "newGame");

    gameController.startAction();
    await sleep(600);
    expect(gameModel.nextGeneration).toHaveBeenCalledTimes(1);
    expect(gameView.updateField).toHaveBeenCalledTimes(1);

    gameModel.nextGeneration = jest.fn().mockReturnValue(false);
    await sleep(600);
    expect(gameController.stopAction).toHaveBeenCalledTimes(1);
    expect(gameController.newGame).toHaveBeenCalledTimes(1);
  });

  it(".changeSize", () => {
    const width = 5;
    const height = 10;
    gameController.changeSize(width, height);

    expect(gameModel.setSize).toHaveBeenCalledWith(width, height);
    expect(gameView.setSize).toHaveBeenCalledWith(width, height);
    expect(gameView.updateField).toHaveBeenCalledWith(gameModel.getState());
  });

  it(".changeSpeed", () => {
    const newSpeed = 0.5;
    gameController.startAction = jest.fn(function startAction(
      this: GameController
    ) {
      this.isActive = true;
    });
    gameController.stopAction = jest.fn();

    gameController.startAction();
    gameController.changeSpeed(newSpeed);
    expect(gameController.getSpeed()).toBe(newSpeed);
    expect(gameController.stopAction).toHaveBeenCalled();
    expect(gameController.startAction).toHaveBeenCalledTimes(2);
  });

  it(".fillRandomly", () => {
    const spyMathRandom = jest
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0.55)
      .mockReturnValue(0.2);
    gameController.fillRandomly();
    const countCells = state.reduce(
      (count: number, col: Cell[]): number => count + col.length,
      0
    );

    expect(spyMathRandom).toHaveBeenCalledTimes(countCells);
    expect(gameModel.toggleCellState).toHaveBeenCalledTimes(2);
  });
});
