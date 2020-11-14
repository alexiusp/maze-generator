import { EWallPosition, ICellModel } from './cell/Cell.model';
import { ILabyrinthModel } from './labyrinth/Labyrinth.model';

export enum EGeneratorAlgorythm {
  AuldosBroder,
}

export const SupportedAlgorythms = [{ label: 'Auldos-Broder algorythm', value: EGeneratorAlgorythm.AuldosBroder }];

function auldosBroderGenerator(labyrinth: ILabyrinthModel) {
  // copy cells
  const _cells = [];
  for (let y = 0; y < labyrinth.height; y++) {
    const row = [];
    for (let x = 0; x < labyrinth.width; x++) {
      const _cell: ICellModel = {
        ...labyrinth.cells[y][x],
      };
      row.push(_cell);
    }
    _cells.push(row);
  }
  // generate visits map
  const visits = [];
  for (let y = 0; y < labyrinth.height; y++) {
    const row = [];
    for (let x = 0; x < labyrinth.width; x++) {
      row.push(false);
    }
    visits.push(row);
  }
  // create counter to detect final state faster
  let visitedCount = 0;
  const allVisited = () => visitedCount === labyrinth.width * labyrinth.height;
  // check if cell is in the labyrinth borders
  const isCellPresent = (x: number, y: number) => x >= 0 && x < labyrinth.width && y >= 0 && y < labyrinth.height;
  // select a cell randomly
  let currentX = Math.floor(Math.random() * labyrinth.width);
  let currentY = Math.floor(Math.random() * labyrinth.height);
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

export function getGenerator(algorythm: EGeneratorAlgorythm) {
  switch (algorythm) {
    default:
      return auldosBroderGenerator
  }
}
