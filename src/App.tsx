import {
  Alignment,
  Button,
  Card,
  Classes,
  Drawer,
  Elevation,
  FormGroup,
  H5,
  Navbar,
  NumericInput,
  Position,
} from '@blueprintjs/core';
import React, { useState } from 'react';

import './App.css';
import { auldosBroderGenerator } from './generator';

import Labyrinth from './labyrinth/Labyrinth';
import { initLabyrinth, LabyrinthCells } from './labyrinth/Labyrinth.model';
import { useSettings } from './settingHooks';

function print() {
  const l = document.getElementById('labyrinth');
  if (!l) {
    return;
  }
  const a = window.open('', '', 'height=640, width=640');
  if (!a) {
    return;
  }
  a.document.write('<html>');
  a.document.write('<body>');
  a.document.write(l.outerHTML);
  a.document.write('</body></html>');
  a.document.close();
  a.print();
}

function App() {
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(20);
  const [settings, setSettings] = useSettings();
  const [drawer, toggleDrawer] = useState(false);
  const [cells, setCells] = useState<LabyrinthCells>([]);
  const toggleHandler = () => toggleDrawer(!drawer);
  const setCellWidth = (CellWidth: number) =>
    setSettings({
      ...settings,
      CellWidth,
    });
  const setCellHeight = (CellHeight: number) =>
    setSettings({
      ...settings,
      CellHeight,
    });
  const setLineWidth = (LineWidth: number) =>
    setSettings({
      ...settings,
      LineWidth,
    });
  const generateAuldosBroder = () => {
    const l = initLabyrinth(height, width);
    const newCells = auldosBroderGenerator(l);
    setCells(newCells);
  };
  return (
    <>
      <div className={`App ${Classes.DARK}`}>
        <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>Maze builder</Navbar.Heading>
            <Button onClick={generateAuldosBroder} icon="function">
              Aldous-Broder algorythm
            </Button>
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            <Button icon="print" minimal={true} onClick={print} />
            <Navbar.Divider />
            <Button icon="cog" minimal={true} onClick={toggleHandler} />
          </Navbar.Group>
        </Navbar>
        <div className="App-body">
          <Card className="labyrinth-card" elevation={Elevation.THREE}>
            <Labyrinth cells={cells} height={height} width={width} />
          </Card>
        </div>
      </div>
      <Drawer
        isOpen={drawer}
        onClose={toggleHandler}
        position={Position.LEFT}
        size={Drawer.SIZE_SMALL}
        title="Settings"
        className={Classes.DARK}>
        <Card className="settings-card">
          <H5>Labyrinth size</H5>
          <div className="size-settings">
            <FormGroup label="Width" labelFor="width-input" inline={true}>
              <NumericInput id="width-input" onValueChange={setWidth} value={width} />
            </FormGroup>
            <FormGroup label="Height" labelFor="height-input" inline={true}>
              <NumericInput id="height-input" onValueChange={setHeight} value={height} />
            </FormGroup>
          </div>
        </Card>
        <Card className="settings-card">
          <H5>Drawing settings</H5>
          <div className="draw-settings">
            <FormGroup label="Cell width" labelFor="cell-width-input" inline={true}>
              <NumericInput id="cell-width-input" onValueChange={setCellWidth} value={settings.CellWidth} />
            </FormGroup>
            <FormGroup label="Cell height" labelFor="cell-height-input" inline={true}>
              <NumericInput id="cell-height-input" onValueChange={setCellHeight} value={settings.CellHeight} />
            </FormGroup>
            <FormGroup label="Line width" labelFor="line-width-input" inline={true}>
              <NumericInput id="line-width-input" onValueChange={setLineWidth} value={settings.LineWidth} />
            </FormGroup>
          </div>
        </Card>
      </Drawer>
    </>
  );
}

export default App;
