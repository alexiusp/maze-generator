import { EWallPosition, ICellModel } from './cell/Cell.model';
import { ILabyrinthModel, initClosedLabyrinth, initOpenedLabyrinth, LabyrinthCells } from './labyrinth/Labyrinth.model';

export enum EGeneratorAlgorythm {
  AuldosBroder,
  Eller,
}

export const SupportedAlgorythms = [{ label: 'Auldos-Broder algorythm', value: EGeneratorAlgorythm.AuldosBroder },{ label: 'Eller\'s algorythm', value: EGeneratorAlgorythm.Eller }];

function auldosBroderGenerator(height: number, width: number) {
  // generate labyrinth filled with walls
  const _cells = initClosedLabyrinth(height, width).cells;
  // generate visits map
  const visits = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(false);
    }
    visits.push(row);
  }
  // create counter to detect final state faster
  let visitedCount = 0;
  const allVisited = () => visitedCount === width * height;
  // check if cell is in the labyrinth borders
  const isCellPresent = (x: number, y: number) => x >= 0 && x < width && y >= 0 && y < height;
  // select a cell randomly
  let currentX = Math.floor(Math.random() * width);
  let currentY = Math.floor(Math.random() * height);
  let nextCellX = 0;
  let nextCellY = 0;
  while (!allVisited()) {
    // try to find next cell
    let directionFound = false;
    let direction: EWallPosition = EWallPosition.Top;
    let opposite: EWallPosition = EWallPosition.Bottom;
    while (!directionFound) {
      direction = Math.floor(Math.random() * 4) as EWallPosition;
      switch (direction) {
        case EWallPosition.Top:
          nextCellX = currentX;
          nextCellY = currentY - 1;
          directionFound = isCellPresent(nextCellX, nextCellY);
          opposite = EWallPosition.Bottom;
          break;
        case EWallPosition.Right:
          nextCellX = currentX + 1;
          nextCellY = currentY;
          directionFound = isCellPresent(nextCellX, nextCellY);
          opposite = EWallPosition.Left;
          break;
        case EWallPosition.Bottom:
          nextCellX = currentX;
          nextCellY = currentY + 1;
          directionFound = isCellPresent(nextCellX, nextCellY);
          opposite = EWallPosition.Top;
          break;
        default:
          nextCellX = currentX - 1;
          nextCellY = currentY;
          directionFound = isCellPresent(nextCellX, nextCellY);
          opposite = EWallPosition.Right;
          break;
      }
    }
    // check if cell was visited
    const isVisited = visits[nextCellY][nextCellX];
    // remove walls if was not visited
    if (!isVisited) {
      // mark and count visit
      visits[nextCellY][nextCellX] = true;
      visitedCount += 1;
      // remove walls
      _cells[currentY][currentX].walls[direction] = false;
      _cells[nextCellY][nextCellX].walls[opposite] = false;
    }
    // set next cell as current
    currentX = nextCellX;
    currentY = nextCellY;
  }
  // return cells
  return _cells;
}

interface IEllersCell extends ICellModel {
  set: number;
}

function generateVerticalWalls(row: IEllersCell[]) {
  const result = [...row];
  for (let x = 0; x < result.length - 1; x++) {
    if (result[x].set === result[x + 1].set) {
      // create wall if in the same set
      result[x].walls[EWallPosition.Right] = true;
      result[x + 1].walls[EWallPosition.Left] = true;
    } else {
      const createWall = Math.round(Math.random());
      if (createWall) {
        result[x].walls[EWallPosition.Right] = true;
        result[x + 1].walls[EWallPosition.Left] = true;
      } else {
        // merge sets
        result[x + 1].set = result[x].set;
      }
    }
  }
  return result;
}

function ellerGenerator(height: number, width: number) {
  const labyrinth: ILabyrinthModel = initOpenedLabyrinth(height, width);
  let rowIndex = 0;
  let maxSet = 1;
  const _cells: LabyrinthCells = [];
  // 1. initialize first row
  let row: IEllersCell[] = [];
  for (let x = 0; x < width; x++) {
    const cell: IEllersCell = {
      x,
      y: rowIndex,
      walls: [...labyrinth.cells[rowIndex][x].walls],
      set: 0,
    };
    row.push(cell);
  }
  while (rowIndex < height - 1) {
    // 2. assign cells to sets
    for (let x = 0; x < width; x++) {
      if (!row[x].set) {
        row[x].set = maxSet;
        maxSet += 1;
      }
    }
    // generate vertical walls
    row = generateVerticalWalls(row);
    // generate horizontal walls
    let connectionPresent = false;
    for (let x = 0; x < width; x++) {
      const createWall = Math.round(Math.random());
      const isLastInSet = x === width - 1 || row[x].set !== row[x + 1].set;
      if (!createWall) {
        connectionPresent = true;
      } else {
        if (connectionPresent || !isLastInSet) {
          row[x].walls[EWallPosition.Bottom] = true;
        }
        /*
        if (!(isLastInSet && !connectionPresent)) {
          row[x].walls[EWallPosition.Bottom] = true;
        }
        */
      }
      if (isLastInSet) {
        // prepare for the next set
        connectionPresent = false;
      }
    }
    // put created row to results
    _cells.push(row);
    // create new row
    rowIndex += 1;
    const newRow: IEllersCell[] = [];
    for (let x = 0; x < width; x++) {
      const cell: IEllersCell = {
        x,
        y: rowIndex,
        walls: [...labyrinth.cells[rowIndex][x].walls],
        set: row[x].set,
      };
      cell.walls[EWallPosition.Top] = row[x].walls[EWallPosition.Bottom];
      cell.walls[EWallPosition.Bottom] = row[x].walls[EWallPosition.Bottom];
      newRow.push(cell);
    }
    // remove set for cells with bottom wall and remove bottom walls
    for (let x = 0; x < width; x++) {
      if (newRow[x].walls[EWallPosition.Bottom]) {
        newRow[x].set = 0;
      }
      newRow[x].walls[EWallPosition.Bottom] = false;
    }
    row = newRow;
  }
  // last row generation
  let lastRow: IEllersCell[] = [];
  for (let x = 0; x < width; x++) {
    // copy cell
    const cell: IEllersCell = {
      x,
      y: rowIndex,
      walls: [...labyrinth.cells[rowIndex][x].walls],
      set: row[x].set,
    };
    cell.walls[EWallPosition.Top] = row[x].walls[EWallPosition.Top];
    if (!cell.set) {
      cell.set = maxSet;
      maxSet += 1;
    }
    lastRow.push(cell);
  }
  // generate walls as usual
  lastRow = generateVerticalWalls(lastRow);
  // remove walls for non same set cells
  for (let x = 0; x < width - 1; x++) {
    if (lastRow[x].set !== lastRow[x+1].set) {
      lastRow[x].walls[EWallPosition.Right] = false;
      lastRow[x+1].walls[EWallPosition.Left] = false;
      lastRow[x+1].set = lastRow[x].set;
    }
  }
  _cells.push(lastRow);
  return _cells;
}

export function getGenerator(algorythm: EGeneratorAlgorythm) {
  switch (algorythm) {
    case EGeneratorAlgorythm.Eller:
      return ellerGenerator;
    default:
      return auldosBroderGenerator;
  }
}
