import { GameView } from "./gameView";
import { GameModel } from "./gameModel";
import { Cell } from "./types/Cell";

describe("GameView", () => {
  const width = 5;
  const height = 6;
  let gameView: GameView;
  let gameModel: GameModel;
  let gameField: HTMLElement;
  let field: Cell[][];

  beforeEach(() => {
    gameModel = new GameModel(width, height);
    field = gameModel.getState();
    gameField = document.createElement("section");
    gameField.classList.add("field");

    gameView = new GameView(gameField, field);
  });

  it("is a class", () => {
    expect(GameView).toBeInstanceOf(Function);
    expect(gameView).toBeInstanceOf(GameView);
  });

  it("supports constructor(field)", () => {
    const cellCount = gameField.querySelectorAll(".field__cell").length;
    expect(cellCount).toBe(width * height);
  });

  it(".updateField", () => {
    const aliveElements = [
      [0, 0],
      [1, 1],
      [2, 0],
    ];
    aliveElements.forEach(([x, y]) => {
      gameModel.toggleCellState(x, y);
    });
    gameView.updateField(gameModel.getState());

    const aliveCells: NodeListOf<HTMLElement> = gameField.querySelectorAll(
      ".field__cell--alive"
    );
    expect(aliveCells.length).toBe(aliveElements.length);

    const cells: NodeListOf<HTMLElement> =
      gameField.querySelectorAll(".field__cell");
    expect(cells.length).toBe(width * height);

    for (const cell of cells) {
      const coordinates = GameView.getCoordinates(cell);
      const hasToBeAlive = aliveElements.some(
        ([x, y]) => x === coordinates[0] && y === coordinates[1]
      );

      if (hasToBeAlive) {
        expect(cell.classList.contains("field__cell--alive")).toBeTruthy();
      } else {
        expect(cell.classList.contains("field__cell--alive")).toBeFalsy();
      }
    }
  });
});
