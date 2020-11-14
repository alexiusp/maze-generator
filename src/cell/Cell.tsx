import React, { useEffect, useState } from 'react';

import { useSettings } from '../settingHooks';
import { EWallPosition, ICellModel } from './Cell.model';

export interface ICellProps {
  cell: ICellModel;
}

const Cell: React.FC<ICellProps> = ({ cell }) => {
  const [{ CellHeight, CellWidth, LineWidth }] = useSettings();
  const [ pathData, setPathData ] = useState('');
  useEffect(() => {
    const { walls, x, y } = cell;
    const moveTo = `M${x * CellWidth} ${y * CellHeight}`;
    const leftWall = walls[EWallPosition.Left];
    const left = `${leftWall ? 'l' : 'm'}0 ${CellHeight}`;
    const bottomWall = walls[EWallPosition.Bottom];
    const bottom = `${bottomWall ? 'l' : 'm'}${CellWidth} 0`;
    const rightWall = walls[EWallPosition.Right];
    const right = `${rightWall ? 'l' : 'm'}0 -${CellHeight}`;
    const topWall = walls[EWallPosition.Top];
    const top = `${topWall ? 'l' : 'm'}-${CellWidth} 0`;
    const pathData = `${moveTo} ${left} ${bottom} ${right} ${top}`;
    setPathData(pathData);
  }, [ CellHeight, CellWidth, cell ]);
  return <path stroke="#333" fill="none" d={pathData} strokeWidth={LineWidth} />;
};
export default Cell;
