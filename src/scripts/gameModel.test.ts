import { GameModel } from "./gameModel";

describe("GameModel", () => {
  describe("check interface", () => {
    it("is a class", () => {
      expect(GameModel).toBeInstanceOf(Function);
      expect(new GameModel()).toBeInstanceOf(GameModel);
    });

    it("has .getState method", () => {
      const gameModel = new GameModel();
      expect(gameModel.getState).toBeInstanceOf(Function);
      expect(gameModel.getState()).toEqual([[]]);
    });
  });

  describe("functional tests", () => {
    const width = 2;
    const height = 3;
    let gameModel: GameModel;

    beforeEach(() => {
      gameModel = new GameModel(width, height);
    });

    it("supports constructor(width, height)", () => {
      expect(gameModel.getState()).toEqual([
        [0, 0],
        [0, 0],
        [0, 0],
      ]);
    });

    it(".toggleCellState", () => {
      gameModel.toggleCellState(0, 0);
      expect(gameModel.getState()).toEqual([
        [1, 0],
        [0, 0],
        [0, 0],
      ]);

      gameModel.toggleCellState(1, 1);
      expect(gameModel.getState()).toEqual([
        [1, 0],
        [0, 1],
        [0, 0],
      ]);

      gameModel.toggleCellState(0, 0);
      expect(gameModel.getState()).toEqual([
        [0, 0],
        [0, 1],
        [0, 0],
      ]);
    });

    it(".setSize", () => {
      gameModel.setSize(4, 2);
      expect(gameModel.getState()).toEqual([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      gameModel.toggleCellState(1, 1);
      gameModel.toggleCellState(3, 1);
      expect(gameModel.getState()).toEqual([
        [0, 0, 0, 0],
        [0, 1, 0, 1],
      ]);

      gameModel.setSize(3, 3);
      expect(gameModel.getState()).toEqual([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ]);
    });

    it(".isInsideField", () => {
      gameModel.setSize(3, 3);
      expect(gameModel.isInsideField(-1, 0)).toBeFalsy();
      expect(gameModel.isInsideField(1, -1)).toBeFalsy();
      expect(gameModel.isInsideField(-1, -1)).toBeFalsy();
      expect(gameModel.isInsideField(3, -0)).toBeFalsy();
      expect(gameModel.isInsideField(1, 3)).toBeFalsy();
      expect(gameModel.isInsideField(1, 4)).toBeFalsy();
      expect(gameModel.isInsideField(1, 2)).toBeTruthy();
      expect(gameModel.isInsideField(0, 0)).toBeTruthy();
    });

    it(".countNeighbors", () => {
      gameModel.setSize(3, 3);
      gameModel.toggleCellState(0, 1);
      gameModel.toggleCellState(1, 0);
      gameModel.toggleCellState(1, 1);
      gameModel.toggleCellState(2, 1);
      gameModel.toggleCellState(1, 2);
      expect(gameModel.getState()).toEqual([
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
      ]);
      expect(gameModel.countNeighbors(0, 0)).toBe(3);
      expect(gameModel.countNeighbors(1, 1)).toBe(4);
      expect(gameModel.countNeighbors(2, 1)).toBe(3);
    });

    it(".nextGeneration", () => {
      gameModel.setSize(4, 4);
      gameModel.toggleCellState(0, 0);
      gameModel.toggleCellState(1, 0);
      gameModel.toggleCellState(0, 1);
      expect(gameModel.getState()).toEqual([
        [1, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      expect(gameModel.nextGeneration()).toBeTruthy();
      expect(gameModel.getState()).toEqual([
        [1, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      gameModel.toggleCellState(1, 2);
      gameModel.toggleCellState(2, 2);
      gameModel.toggleCellState(2, 1);
      expect(gameModel.getState()).toEqual([
        [1, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
      ]);
      expect(gameModel.nextGeneration()).toBeTruthy();
      expect(gameModel.getState()).toEqual([
        [1, 0, 1, 0],
        [0, 0, 0, 0],
        [1, 0, 1, 0],
        [0, 0, 0, 0],
      ]);

      expect(gameModel.nextGeneration()).toBeTruthy();
      expect(gameModel.getState()).toEqual([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      expect(gameModel.nextGeneration()).toBeFalsy();

      gameModel.setSize(2, 3);
      gameModel.toggleCellState(0, 0);
      gameModel.toggleCellState(1, 1);
      gameModel.toggleCellState(0, 1);
      gameModel.toggleCellState(1, 0);
      expect(gameModel.getState()).toEqual([
        [1, 1],
        [1, 1],
        [0, 0],
      ]);
      expect(gameModel.nextGeneration()).toBeFalsy();

      gameModel.toggleCellState(1, 2);
      expect(gameModel.nextGeneration()).toBeTruthy();
    });

    it(".clearField", () => {
      gameModel.toggleCellState(1, 1);
      gameModel.toggleCellState(0, 0);
      expect(gameModel.getState()).toEqual([
        [1, 0],
        [0, 1],
        [0, 0],
      ]);
      gameModel.clearField();
      expect(gameModel.getState()).toEqual([
        [0, 0],
        [0, 0],
        [0, 0],
      ]);
    });
  });
});
