import React, { useEffect, useState } from 'react';
import Cell from '../cell/Cell';
import { ICellModel } from '../cell/Cell.model';
import { useSettings } from '../settingHooks';
import { LabyrinthCells } from './Labyrinth.model';

export interface ILabyrinthProps {
  cells: LabyrinthCells;
  height: number;
  width: number;
}

const Labyrinth: React.FC<ILabyrinthProps> = ({ cells, height, width }) => {
  const [viewbox, setViewBox] = useState<string>(`0 0 400 400`);
  const [{ CellHeight, CellWidth }] = useSettings();
  useEffect(() => {
    const newViewbox = `0 0 ${width * CellWidth} ${height * CellHeight}`;
    setViewBox(newViewbox);
  }, [height, width, CellHeight, CellWidth]);
  const drawRow = (cells: ICellModel[], index: number) => (
    <g className="row" key={index}>
      {cells.map((cell) => (
        <Cell cell={cell} key={`${cell.x}-${cell.y}`} />
      ))}
    </g>
  );
  const field = <>{cells.map(drawRow)}</>;
  return (
    <>
      <svg id="labyrinth" className="labyrinth-canvas" xmlns="http://www.w3.org/2000/svg" viewBox={viewbox}>
        <g className="labyrinth-box">
          {field}
        </g>
      </svg>
    </>
  );
};
export default Labyrinth;
