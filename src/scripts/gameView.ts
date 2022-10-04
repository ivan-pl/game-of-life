import { Cell } from "./types/Cell";
import { IGameController } from "./gameController";

export interface IGameView {
  updateField(field: Cell[][]): void;
  setSize(width: number, height: number): void;
  initialize(controller: IGameController): void;
  onCellClick(event: Event): void;
}

export class GameView implements IGameView {
  field: HTMLElement;

  gameController: IGameController | undefined;

  constructor(el: HTMLElement) {
    this.field = el;
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
        cell.addEventListener("click", this.onCellClick);
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
  }
}
