export enum EWallPosition {
  Top,
  Right,
  Bottom,
  Left,
};

export interface ICellModel {
  x: number;
  y: number;
  walls: boolean[];
}

export function createCell(x: number, y: number, walls: boolean[] = [false, false, false, false]) {
  const cell: ICellModel = {
    x,
    y,
    walls,
  };
  return cell;
}

export function createClosedCell(x: number, y: number) {
  return createCell(x, y, [true, true, true, true]);
}

export function setWall(cell: ICellModel, wallPos: EWallPosition) {
  const walls = [...cell.walls];
  walls[wallPos] = true;
  return {
    ...cell,
    walls,
  } as ICellModel;
}

export function setTopWall(cell: ICellModel) {
  return setWall(cell, EWallPosition.Top);
}

export function setRightWall(cell: ICellModel) {
  return setWall(cell, EWallPosition.Right);
}

export function setBottomWall(cell: ICellModel) {
  return setWall(cell, EWallPosition.Bottom);
}

export function setLeftWall(cell: ICellModel) {
  return setWall(cell, EWallPosition.Left);
}

export function removeWall(cell: ICellModel, wallPos: EWallPosition) {
  const walls = [...cell.walls];
  walls[wallPos] = false;
  return {
    ...cell,
    walls,
  } as ICellModel;
}

export function removeTopWall(cell: ICellModel) {
  return removeWall(cell, EWallPosition.Top);
}

export function removeRightWall(cell: ICellModel) {
  return removeWall(cell, EWallPosition.Right);
}

export function removeBottomWall(cell: ICellModel) {
  return removeWall(cell, EWallPosition.Bottom);
}

export function removeLeftWall(cell: ICellModel) {
  return removeWall(cell, EWallPosition.Left);
}
