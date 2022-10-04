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
      nextGeneration: jest.fn(),
      setSize: jest.fn(),
      isGameFinished: jest.fn(),
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

    gameModel.isGameFinished = jest.fn().mockReturnValue(true);
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
});
