/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import * as XLSX from 'xlsx';
import moment from 'moment';
/* import { readFile, set_fs, utils, writeFile } from 'xlsx'; */
/* import MenuBuilder from './menu'; */
import { resolveHtmlPath } from './util';
import { storage, getExcelSheetName, getItemSheetName } from './logic/storage';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const loadItems = async (event: Electron.IpcMainEvent) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow!, {
      title: 'Cargar Items',
      filters: [
        {
          name: 'Spreadsheets',
          extensions: [
            'xlsx',
            'xls',
            'xlsb',
            'xlsm' /* ... other formats ... */,
          ],
        },
      ],
    });
    if (canceled) throw Error('Canceled');
    const workbook = XLSX.readFile(filePaths[0] || '', {
      sheets: getItemSheetName(),
      raw: true,
      dense: true,
    });
    const sheetName =
      workbook.SheetNames.find(
        (e) => e.toLowerCase() === getItemSheetName().toLocaleLowerCase()
      ) || '';
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      blankrows: false,
      header: 'A',
    }) as ItemRow[];
    const items: { [key: string]: { descripcion: string } } = {};
    sheet.map((element, index) => {
      if (index > 3) {
        items[element.A] = { descripcion: element?.D || '' };
      }
      return null;
    });
    storage.set('items', items);
  } catch (error) {
    console.error(error);
  } finally {
    event.returnValue = true;
  }
  /* set_fs(fs);
  const items: Items = {};
  const workbook = readFile(filename, { sheets: sheetName });
  console.log('hola', workbook); */
};

const removeBlankRows = async (event: Electron.IpcMainEvent) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow!, {
      title: 'Borrar filas',
      filters: [
        {
          name: 'Spreadsheets',
          extensions: ['xlsx', 'xls', 'xlsb' /* ... other formats ... */],
        },
      ],
    });
    if (canceled) throw Error('Canceled');
    const workbook = XLSX.readFile(filePath || '', {
      cellFormula: true,
      sheets: getExcelSheetName(),
      cellDates: true,
      xlfn: true,
      dense: true,
    });
    const sheet = workbook.Sheets[getExcelSheetName()]; // |undefined
    let sheetJson = XLSX.utils.sheet_to_json(sheet, { blankrows: true });
    sheetJson = sheetJson.filter((e) => Object.keys(e || {}).length !== 0);
    const editedSheet = XLSX.utils.json_to_sheet(sheetJson);
    workbook.Sheets[getExcelSheetName()] = editedSheet;
    XLSX.writeFile(workbook, filePath || '');
  } catch (error) {
    console.error(error);
  } finally {
    event.returnValue = true;
  }
};

const saveExcel = async (
  event: Electron.IpcMainEvent,
  data: any[] | undefined,
  colHeaders: (string | number)[] | undefined
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const dialogInfo = await dialog.showSaveDialog(mainWindow!, {
      title: 'Guardar archivo',
      filters: [
        {
          name: 'Spreadsheets',
          extensions: ['xlsx', 'xls', 'xlsb' /* ... other formats ... */],
        },
      ],
    });
    // xlsx
    let workbook = XLSX.utils.book_new();
    /* EXCELJS
    const workbook = new Workbook(); */
    console.log({ dialogInfo });
    if (dialogInfo.canceled) throw Error('Canceled');
    const cleanData = data?.filter((row) => !row.every((e: any) => e === null));
    console.log({ cleanData });
    if (cleanData?.length === 0) throw Error('No Values where added');
    const jsonData: Gasto[] = [];
    cleanData?.forEach((e) => {
      const [day, month, year] = String(
        e[colHeaders?.indexOf('Fecha') || 0]
      ).split('-');
      const object: Gasto = {
        fecha: {
          v: moment(`${year}-${month}-${day}`).toDate(),
          t: 'd',
          f: !!year && !!month && !!day ? `DATE(${year},${month},${day})` : '',
        },
        especialidad: e[colHeaders?.indexOf('Especialidad') || 0],
        capataz: e[colHeaders?.indexOf('Capataz') || 0],
        item: e[colHeaders?.indexOf('Item') || 0],
        'no directo': e[colHeaders?.indexOf('No Directo') || 0] || 0,
        directo: e[colHeaders?.indexOf('Directos') || 0] || 0,
        oficina: e[colHeaders?.indexOf('Oficina') || 0] || 0,
        equipo: e[colHeaders?.indexOf('Equipos') || 0] || 0,
        total: e[colHeaders?.indexOf('Total') || 0] || 0,
        // eslint-disable-next-line prettier/prettier
        'descripción': e[colHeaders?.indexOf('Descripcion') || 0],
        comentario: e[colHeaders?.indexOf('Comentario') || 0],
        // eslint-disable-next-line prettier/prettier
        'ubicación': e[colHeaders?.indexOf('Ubicación') || 0],
      };
      jsonData.push(object);
    });
    console.log('jsonData', jsonData);
    try {
      // VEMOS SI EL ARCHIVO EXISTE
      // ----------------------------------------------------
      // XLSX
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      workbook = XLSX.readFile(dialogInfo.filePath || '', {
        cellFormula: true,
        sheets: getExcelSheetName(),
        cellDates: true,
        xlfn: true,
        dense: true,
      });
      let sheet = workbook.Sheets[getExcelSheetName()]; // |undefined
      if (sheet !== undefined) {
        XLSX.utils.sheet_add_json(sheet, jsonData, {
          origin: -1,
          skipHeader: true,
        });
      } else {
        sheet = XLSX.utils.json_to_sheet(jsonData);
        XLSX.utils.book_append_sheet(workbook, sheet, getExcelSheetName());
      }
      XLSX.writeFile(workbook, dialogInfo.filePath || '');
    } catch (error) {
      console.log('NO EXISTE', error);
      const sheet = XLSX.utils.json_to_sheet(jsonData);
      XLSX.utils.book_append_sheet(workbook, sheet, getExcelSheetName());
      XLSX.writeFile(workbook, dialogInfo.filePath || '');
    }
  } catch (error) {
    console.error(error);
  } finally {
    event.returnValue = true;
  }
};

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = storage.get(val);
});

ipcMain.on('electron-store-set', async (event, key, val) => {
  storage.set(key, val);
});
ipcMain.on('electron-store-delete', async (event, key) => {
  storage.delete(key);
});
ipcMain.on('open-file', async (event) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  event.returnValue = dialog.showOpenDialogSync(mainWindow!, {
    properties: ['openFile'],
  });
});
ipcMain.on('save-excel', saveExcel);
ipcMain.on('remove-blank-rows', removeBlankRows);
ipcMain.on('save-file', async (event) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    event.returnValue = await dialog.showSaveDialog(mainWindow!);
  } catch (e) {
    console.error(e);
  }
});
ipcMain.on('exists-sync', (event, pathfile: string) => {
  event.returnValue = existsSync(pathfile);
});

ipcMain.on('fs', async (event) => {
  event.returnValue = fs;
});
ipcMain.on('load-items', loadItems);

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  /* const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu(); */

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};
/**
 * Add event listeners...
 */
app.on('before-quit', () => {
  storage.delete('data');
});
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
