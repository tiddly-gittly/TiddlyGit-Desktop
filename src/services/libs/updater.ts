import { app, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import sendToAllWindows from './send-to-all-windows';
import createMenu from './create-menu';
import * as mainWindow from '../windows/main';
(global as any).updateSilent = true;
global.updaterObj = {};
autoUpdater.on('checking-for-update', () => {
  global.updaterObj = {
    status: 'checking-for-update',
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});
autoUpdater.on('update-available', (info: any) => {
  if (!(global as any).updateSilent) {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'BrowserWindow | undefined' is no... Remove this comment to see the full error message
    dialog.showMessageBox(mainWindow.get(), {
      title: 'An Update is Available',
      message: 'There is an available update. It is being downloaded. We will let you know when it is ready.',
      buttons: ['OK'],
      cancelId: 0,
      defaultId: 0,
    });
    (global as any).updateSilent = true;
  }
  global.updaterObj = {
    status: 'update-available',
    info,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});
autoUpdater.on('update-not-available', (info: any) => {
  if (!(global as any).updateSilent) {
    dialog
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'BrowserWindow | undefined' is no... Remove this comment to see the full error message
      .showMessageBox(mainWindow.get(), {
        title: 'No Updates',
        message: 'There are currently no updates available.',
        buttons: ['OK'],
        cancelId: 0,
        defaultId: 0,
        }).catch(console.log); // eslint-disable-line
    (global as any).updateSilent = true;
  }
  global.updaterObj = {
    status: 'update-not-available',
    info,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});
autoUpdater.on('error', (error: any) => {
  if (!(global as any).updateSilent) {
    dialog
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'BrowserWindow | undefined' is no... Remove this comment to see the full error message
      .showMessageBox(mainWindow.get(), {
        title: 'Failed to Check for Updates',
        message: 'Failed to check for updates. Please check your Internet connection.',
        buttons: ['OK'],
        cancelId: 0,
        defaultId: 0,
        }).catch(console.log); // eslint-disable-line
    (global as any).updateSilent = true;
  }
  sendToAllWindows('log', error);
  global.updaterObj = {
    status: 'error',
    info: error,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});
autoUpdater.on('update-cancelled', () => {
  global.updaterObj = {
    status: 'update-cancelled',
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});
autoUpdater.on('download-progress', (progressObject: any) => {
  global.updaterObj = {
    status: 'download-progress',
    info: progressObject,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
});
autoUpdater.on('update-downloaded', (info: any) => {
  global.updaterObj = {
    status: 'update-downloaded',
    info,
  };
  sendToAllWindows('update-updater', global.updaterObj);
  createMenu();
  const dialogOptions = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    detail: `A new version (${info.version}) has been downloaded. Restart the application to apply the updates.`,
    cancelId: 1,
  };
  dialog
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'BrowserWindow | undefined' is no... Remove this comment to see the full error message
    .showMessageBox(mainWindow.get(), dialogOptions)
    .then(({ response }) => {
      if (response === 0) {
        // Fix autoUpdater.quitAndInstall() does not quit immediately
        // https://github.com/electron/electron/issues/3583
        // https://github.com/electron-userland/electron-builder/issues/1604
        setImmediate(() => {
          app.removeAllListeners('window-all-closed');
          const win = mainWindow.get();
          if (win != undefined) {
            (win as any).forceClose = true;
            win.close();
          }
          autoUpdater.quitAndInstall(false);
        });
      }
    })
        .catch(console.log); // eslint-disable-line
});