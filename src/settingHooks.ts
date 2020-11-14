import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface ISettings {
  CellWidth: number;
  CellHeight: number;
  LineWidth: number;
}

type SetStateHandler = (newState: ISettings) => void;

interface ISettingsStore {
  state: ISettings;
  setters: Dispatch<SetStateAction<ISettings>>[];
  setState: SetStateHandler;
}

class SettingsStore implements ISettingsStore {
  state: ISettings = {
    CellWidth: 20,
    CellHeight: 20,
    LineWidth: 2,
  };
  setters: Dispatch<SetStateAction<ISettings>>[] = [];
  setState: SetStateHandler = (newState: ISettings) => {
    this.state = newState;
    this.setters.forEach((setter) => setter(this.state));
  }
}

const store: ISettingsStore = new SettingsStore();
store.setState.bind(store);

export function useSettings(): [ settings: ISettings, setSettings: (newState: ISettings) => void ] {
  const [ state, setState ] = useState(store.state);
  if(!store.setters.includes(setState)) {
    store.setters.push(setState);
  }

  useEffect(() => {
    return () => {
      store.setters = store.setters.filter(setter => setter !== setState);
    }
  }, []);

  return [ state, store.setState ];
}
