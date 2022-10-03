import { Cell } from "./types/Cell";

export interface IGameView {
  updateField(field: Cell[][]): void;
}

export class GameView implements IGameView {
  field: HTMLElement;

  constructor(el: HTMLElement, field: Cell[][]) {
    for (let row = 0; row < field.length; row++) {
      for (let col = 0; col < field[row].length; col++) {
        const cell = document.createElement("div");
        cell.classList.add("field__cell");
        cell.setAttribute("coordinates", `${col} ${row}`);
        el.append(cell);
      }
      el.append(document.createElement("br"));
    }
    this.field = el;
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
}
