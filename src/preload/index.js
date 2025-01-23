import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import fs from 'fs';
import path from 'path';

const api = {
  createJSONFile: (newObject) => {
    const filePath = path.join(__dirname, 'product.json');
    let data = [];

    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, 'utf-8');
      data = JSON.parse(rawData);
    }

    data.push(newObject);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return filePath;
  },
  readJSONFile: () => {
    const filePath = path.join(__dirname, 'product.json');
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(rawData);
    } else {
      return [];
    }
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api); // Expose your custom API
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api; // Expose your custom API
}
