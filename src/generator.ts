import { copyCell, EWallPosition, ICellModel } from './cell/Cell.model';
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

function copyRow(row: ICellModel[], setRow?: IEllersCell[]) {
  const newRow: IEllersCell[] = [];
  for (let x = 0; x < row.length; x++) {
    const cell: IEllersCell = {
      ...copyCell(row[x]),
      set: setRow ? setRow[x].set : 0,
    };
    newRow.push(cell);
  }
  return newRow;
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
  const { cells }: ILabyrinthModel = initOpenedLabyrinth(height, width);
  let rowIndex = 0;
  let maxSet = 1;
  const _cells: LabyrinthCells = [];
  // 1. initialize first row
  let row: IEllersCell[] = copyRow(cells[rowIndex]);
  console.log('first row before loop:', [...row]);
  // iterate over all rows except the last
  while (rowIndex < height - 1) {
    // 2. assign cells to sets
    for (let x = 0; x < width; x++) {
      if (!row[x].set) {
        row[x].set = maxSet;
        maxSet += 1;
      }
    }
    // generate walls
    row = generateVerticalWalls(row);
    // generate connections
    const setHasConnection: {[set: number]: number} = {};
    const maxConnections = 1;
    for (let x = 0; x < width; x++) {
      const currentSet = row[x].set;
      if (setHasConnection[currentSet] >= maxConnections) {
        // if already have enough connections
        row[x].walls[EWallPosition.Bottom] = true;
      } else {
        const createWall = Math.round(Math.random());
        if (!createWall) {
          setHasConnection[currentSet] = setHasConnection[currentSet] ? setHasConnection[currentSet] + 1 : 1;
        } else {
          row[x].walls[EWallPosition.Bottom] = true;
        }
      }
    }
    // put created row to results
    console.log('current row:', rowIndex, [...row]);
    _cells.push(row);
    // create new row
    rowIndex += 1;
    const newRow: IEllersCell[] = [];
    for (let x = 0; x < width; x++) {
      const cell: IEllersCell = {
        ...copyCell(cells[rowIndex][x]),
        set: row[x].set,
      };
      cell.walls[EWallPosition.Top] = row[x].walls[EWallPosition.Bottom];
      cell.walls[EWallPosition.Bottom] = false;
      // remove set for cells with top wall
      if (cell.walls[EWallPosition.Top]) {
        cell.set = 0;
      }
      newRow.push(cell);
    }
    console.log('new row at the end of loop:', rowIndex, [...newRow]);
    row = newRow;
  }
  // last row generation
  let lastRow: IEllersCell[] = [];
  for (let x = 0; x < width; x++) {
    // copy cell
    const cell: IEllersCell = {
      x,
      y: rowIndex,
      walls: [...cells[rowIndex][x].walls],
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
