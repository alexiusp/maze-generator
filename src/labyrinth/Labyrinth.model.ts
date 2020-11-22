import { createClosedCell, createOpenCell, ICellModel, removeBottomWall, removeTopWall, setBottomWall, setLeftWall, setRightWall, setTopWall } from '../cell/Cell.model';

export type LabyrinthCells = ICellModel[][];

export interface ILabyrinthModel {
  height: number;
  width: number;
  cells: LabyrinthCells;
}

export function initClosedLabyrinth(height: number, width: number) {
  let cells: LabyrinthCells = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      let cell = createClosedCell(x, y);
      if (x === 0 && y === 0) {
        cell = removeTopWall(cell);
      }
      if (x === width - 1 && y === height - 1) {
        cell = removeBottomWall(cell);
      }
      row.push(cell);
    }
    cells.push(row);
  }
  return {
    height,
    width,
    cells,
  } as ILabyrinthModel;
}

export function initOpenedLabyrinth(height: number, width: number) {
  let cells: LabyrinthCells = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      let cell = createOpenCell(x, y);
      if (x === 0) {
        cell = setLeftWall(cell);
      }
      if (x === width - 1) {
        cell = setRightWall(cell);
      }
      if (y === 0) {
        if (x !== 0) {
          cell = setTopWall(cell);
        }
      }
      if (y === height - 1) {
        if (x !== width - 1) {
          cell = setBottomWall(cell);
        }
      }
      row.push(cell);
    }
    cells.push(row);
  }
  return {
    height,
    width,
    cells,
  } as ILabyrinthModel;
}
