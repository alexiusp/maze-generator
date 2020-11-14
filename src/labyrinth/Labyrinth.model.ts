import { createClosedCell, ICellModel, removeBottomWall, removeTopWall } from '../cell/Cell.model';

export type LabyrinthCells = ICellModel[][];

export interface ILabyrinthModel {
  height: number;
  width: number;
  cells: LabyrinthCells;
}

export function initLabyrinth(height: number, width: number, _cells?: LabyrinthCells) {
  let cells = _cells;
  if (!cells) {
    cells = [];
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
  }
  return {
    height,
    width,
    cells,
  } as ILabyrinthModel;
}
