import { Cell } from "./types/Cell";
import { IGameModel } from "./gameModel";
import { IGameView } from "./gameView";
import { GameController, IGameController } from "./gameController";

const randomNum = (): Cell => Number(Math.random() > 0.5) as Cell;

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
    })
  );

  const getView = jest.fn(
    (): IGameView => ({
      updateField: jest.fn(),
      setSize: jest.fn(),
      initialize: jest.fn(),
      onCellClick: jest.fn(),
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
    gameController = new GameController(gameModel, gameView);
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
});
