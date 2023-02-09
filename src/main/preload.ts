/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  store: {
    get(key: string) {
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(property: any, val: any) {
      ipcRenderer.send('electron-store-set', property, val);
    },
    delete(key: string) {
      ipcRenderer.send('electron-store-delete', key);
    },
    // Other method you want to add like has(), reset(), etc.
  },
  dialog: {
    openFile() {
      return ipcRenderer.sendSync('open-file');
    },
    saveFile() {
      return ipcRenderer.sendSync('save-file');
    },
    saveExcel(
      data: any[] | undefined,
      colHeaders: (string | number)[] | undefined
    ) {
      return ipcRenderer.sendSync('save-excel', data, colHeaders);
    },
    removeBlankRow() {
      return ipcRenderer.sendSync('remove-blank-rows');
    },
    loadItems() {
      return ipcRenderer.sendSync('load-items');
    },
  },
};
contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
