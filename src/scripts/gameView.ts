import { Cell } from "./types/Cell";
import { IGameController } from "./gameController";

export interface IGameView {
  updateField(field: Cell[][]): void;
  setSize(width: number, height: number): void;
  initialize(controller: IGameController): void;
  onCellClick(event: Event): void;
  onActionClick(event: Event): void;
  onSetSizeClick(): void;
  setButtonStart(): void;
  onSpeedChange(): void;
  onFillRandomlyClick(): void;
  onClearClick(): void;
}

export class GameView implements IGameView {
  field: HTMLElement;

  actionButton: HTMLButtonElement;

  setSizeButton: HTMLButtonElement;

  clearButton: HTMLButtonElement;

  inputWidth: HTMLInputElement;

  inputHeight: HTMLInputElement;

  inputSpeed: HTMLInputElement;

  outputSpeed: HTMLOutputElement;

  gameController: IGameController | undefined;

  constructor(el: HTMLElement) {
    this.field = el;

    this.actionButton = document.getElementById("action") as HTMLButtonElement;
    this.actionButton.addEventListener("click", (e) => {
      this.onActionClick(e);
    });

    this.setSizeButton = document.getElementById(
      "set-size"
    ) as HTMLButtonElement;
    this.setSizeButton.addEventListener("click", () => {
      this.onSetSizeClick();
    });

    this.clearButton = document.getElementById("clear") as HTMLButtonElement;
    this.clearButton.addEventListener("click", () => this.onClearClick());

    document
      .getElementById("fill-randomly")
      ?.addEventListener("click", () => this.onFillRandomlyClick());

    this.inputWidth = document.getElementById("width") as HTMLInputElement;
    this.inputHeight = document.getElementById("height") as HTMLInputElement;

    this.inputSpeed = document.getElementById("speed") as HTMLInputElement;
    this.outputSpeed = document.getElementById(
      "speed-output"
    ) as HTMLOutputElement;
    this.inputSpeed.addEventListener("input", () => {
      this.onSpeedChange();
    });
  }

  initialize(controller: IGameController): void {
    this.gameController = controller;
    const newField = this.gameController.getField();
    this.setSize(newField[0].length, newField.length);
    this.updateField(newField);
  }

  static getCoordinates(el: HTMLElement): [number, number] {
    const coordAttr = el.getAttribute("coordinates") as string;
    const coordinates: number[] = coordAttr
      .split(" ")
      .map((str) => Number(str));
    return coordinates as [number, number];
  }

  updateField(newField: Cell[][]): void {
    const cells: NodeListOf<HTMLElement> =
      this.field.querySelectorAll(".field__cell");
    for (const cell of cells) {
      const [x, y] = GameView.getCoordinates(cell);

      if (newField[y][x] === 1) {
        cell.classList.add("field__cell--alive");
      } else {
        cell.classList.remove("field__cell--alive");
      }
    }
  }

  setSize(width: number, height: number) {
    this.field.textContent = "";
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const cell = document.createElement("div");
        cell.classList.add("field__cell");
        cell.setAttribute("coordinates", `${col} ${row}`);
        cell.addEventListener("click", (e) => {
          this.onCellClick(e);
        });
        this.field.append(cell);
      }
      if (row < height - 1) {
        this.field.append(document.createElement("br"));
      }
    }
  }

  onCellClick(event: Event): void {
    const cell: HTMLElement = event.target as HTMLElement;
    cell.classList.toggle("field__cell--alive");

    const [x, y] = GameView.getCoordinates(cell);
    this.gameController?.onCellClick(x, y);

    this.disablingButtons();
  }

  onActionClick(event: Event): void {
    const button = event.target as HTMLButtonElement;
    button.innerText = button.innerText === "Start" ? "Stop" : "Start";
    this.gameController?.onActivationClick();
  }

  disablingButtons(): void {
    if (this.field.querySelector(".field__cell--alive")) {
      this.clearButton.disabled = false;
      this.actionButton.disabled = false;
    } else {
      this.clearButton.disabled = true;
      this.actionButton.disabled = true;
    }
  }

  setButtonStart() {
    this.actionButton.innerText = "Start";
  }

  onSetSizeClick(): void {
    const width: number = +this.inputWidth.value;
    const height: number = +this.inputHeight.value;
    this.gameController?.changeSize(width, height);
  }

  onSpeedChange(): void {
    const speed = this.inputSpeed.value;
    this.outputSpeed.innerText = `${speed} s`;
    this.gameController?.changeSpeed(+speed);
  }

  onFillRandomlyClick(): void {
    this.gameController?.fillRandomly();
    this.disablingButtons();
  }

  onClearClick(): void {
    const aliveCells = this.field.querySelectorAll(".field__cell--alive");
    for (const cell of aliveCells) {
      cell.dispatchEvent(new Event("click"));
    }
  }
}
