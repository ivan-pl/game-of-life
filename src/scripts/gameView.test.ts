import { GameView } from "./gameView";
import { GameModel } from "./gameModel";
import { GameController, IGameController } from "./gameController";

describe("GameView", () => {
  const width = 5;
  const height = 6;
  let gameView: GameView;
  let gameModel: GameModel;
  let gameController: IGameController;
  let gameField: HTMLElement;

  function addLayout() {
    gameField = document.createElement("section");
    gameField.classList.add("field");

    const actionButton = document.createElement("button");
    actionButton.id = "action";

    const setSizeButton = document.createElement("button");
    setSizeButton.id = "set-size";

    const inputWidth = document.createElement("input");
    inputWidth.id = "width";

    const inputHeight = document.createElement("input");
    inputHeight.id = "height";

    const inputSpeed = document.createElement("input");
    inputSpeed.id = "speed";

    const outputSpeed = document.createElement("output");
    outputSpeed.id = "speed-output";

    const fillButton = document.createElement("button");
    fillButton.id = "fill-randomly";

    document.body.append(
      gameField,
      setSizeButton,
      actionButton,
      inputHeight,
      inputWidth,
      inputSpeed,
      outputSpeed,
      fillButton
    );
  }

  beforeEach(() => {
    gameModel = new GameModel(width, height);
    addLayout();

    gameView = new GameView(gameField);
    gameController = new GameController(gameModel, gameView);
  });

  it("is a class", () => {
    expect(GameView).toBeInstanceOf(Function);
    expect(gameView).toBeInstanceOf(GameView);
  });

  it(".setSize", () => {
    const newWidth = 6;
    const newHeight = 8;

    gameView.setSize(newWidth, newHeight);
    const cellsCount = gameField.querySelectorAll(".field__cell").length;
    const rows = gameField.querySelectorAll("br").length + 1;
    expect(cellsCount).toBe(newWidth * newHeight);
    expect(rows).toBe(newHeight);
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

  it(".initialize", () => {
    expect(gameView.gameController).toBe(gameController);
    const cells = gameField.querySelectorAll(".field__cell");
    expect(cells.length).toBe(width * height);

    const clickedElements = [1, 4, 7];

    clickedElements.forEach((pos) =>
      cells[pos].dispatchEvent(new Event("click"))
    );
    cells.forEach((cell, pos) => {
      if (clickedElements.includes(pos)) {
        expect(cell.classList.contains("field__cell--alive")).toBeTruthy();
      } else {
        expect(cell.classList.contains("field__cell--alive")).toBeFalsy();
      }
    });

    clickedElements.forEach((pos) =>
      cells[pos].dispatchEvent(new Event("click"))
    );
    cells.forEach((cell) => {
      expect(cell.classList.contains("field__cell--alive")).toBeFalsy();
    });
  });

  it(".onActionClick", () => {
    const button = gameView.actionButton;
    button.innerText = "Start";
    button.dispatchEvent(new Event("click"));
    expect(button.innerText).toBe("Stop");

    button.dispatchEvent(new Event("click"));
    expect(button.innerText).toBe("Start");
  });

  it(".setButtonStart", () => {
    const button = gameView.actionButton;
    const testCases = ["Start", "Stop", "Some text"];
    testCases.forEach((str) => {
      button.innerText = str;
      gameView.setButtonStart();
      expect(button.innerText).toBe("Start");
    });
  });

  it(".onSetSizeClick", () => {
    jest.spyOn(gameView, "setSize");
    const button = document.getElementById("set-size") as HTMLButtonElement;
    const inputWidth = document.getElementById("width") as HTMLInputElement;
    const inputHeight = document.getElementById("height") as HTMLInputElement;

    inputWidth.value = "10";
    inputHeight.value = "12";
    button.dispatchEvent(new Event("click"));
    expect(gameView.setSize).toHaveBeenCalledWith(10, 12);

    inputWidth.value = "3";
    inputHeight.value = "5";
    button.dispatchEvent(new Event("click"));
    expect(gameView.setSize).toHaveBeenCalledWith(3, 5);
  });

  it(".onSpeedChange", () => {
    const input = document.getElementById("speed") as HTMLInputElement;
    const output = document.getElementById("speed-output") as HTMLOutputElement;
    gameController.changeSpeed = jest.fn();

    const speedRange = ["0.5", "1", "3", "5"];
    speedRange.forEach((val) => {
      input.value = val;
      input.dispatchEvent(new Event("input"));
      expect(output.innerText).toBe(`${val} с`);
      expect(gameController.changeSpeed).toHaveBeenCalledWith(+val);
    });
  });

  it(".onFillRandomlyClick", () => {
    const button = document.getElementById(
      "fill-randomly"
    ) as HTMLButtonElement;
    gameController.fillRandomly = jest.fn();

    button.dispatchEvent(new Event("click"));
    expect(gameController.fillRandomly).toHaveBeenCalled();
  });
});
