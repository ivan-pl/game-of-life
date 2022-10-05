import { Cell } from "./types/Cell";

export interface IGameModel {
  getState(): Cell[][];
  toggleCellState(x: number, y: number): void;
  nextGeneration(): void;
  setSize(width: number, height: number): void;
  isGameFinished(): boolean;
  clearField(): void;
}

export class GameModel implements IGameModel {
  field: Cell[][] = [];

  prevField: Cell[][] = [];

  constructor(width = 0, height = 1) {
    for (let row = 0; row < height; row++) {
      this.field.push(new Array(width).fill(0));
    }
    this.prevField = this.field;
  }

  getState(): Cell[][] {
    const copiedField = this.field.map((col) => col.slice());
    return copiedField;
  }

  toggleCellState(x: number, y: number): void {
    if (this.field[y][x] === 1) {
      this.field[y][x] = 0;
    } else {
      this.field[y][x] = 1;
    }
  }

  isInsideField(x: number, y: number) {
    if (x < 0 || y < 0) {
      return false;
    }
    if (y >= this.field.length || x >= this.field[0].length) {
      return false;
    }
    return true;
  }

  countNeighbors(x: number, y: number): number {
    let count = 0;
    for (let row = y - 1; row <= y + 1; row++) {
      for (let col = x - 1; col <= x + 1; col++) {
        if (!this.isInsideField(col, row) || (row === y && col === x)) {
          continue;
        }
        if (this.field[row][col] === 1) {
          count += 1;
        }
      }
    }
    return count;
  }

  nextGeneration() {
    const newField = [];
    for (let row = 0; row < this.field.length; row++) {
      newField.push(new Array(this.field[0].length).fill(0));
      for (let col = 0; col < this.field[0].length; col++) {
        const neighbors = this.countNeighbors(col, row);
        if (this.field[row][col] === 0) {
          newField[row][col] = neighbors === 3 ? 1 : 0;
        } else {
          newField[row][col] = neighbors === 2 || neighbors === 3 ? 1 : 0;
        }
      }
    }

    this.prevField = this.field;
    this.field = newField;
  }

  setSize(width: number, height: number): void {
    const newField = [];

    for (let row = 0; row < height; row++) {
      newField.push(new Array(width));
      for (let col = 0; col < width; col++) {
        newField[row][col] = this.field[row]?.[col] ?? 0;
      }
    }

    this.field = newField;
  }

  isGameFinished() {
    for (let row = 0; row < this.field.length; row++) {
      for (let col = 0; col < this.field[row].length; col++) {
        if (this.field[row][col] !== this.prevField[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  clearField() {
    for (let row = 0; row < this.field.length; row++) {
      for (let col = 0; col < this.field[row].length; col++) {
        this.field[row][col] = 0;
      }
    }
  }
}
