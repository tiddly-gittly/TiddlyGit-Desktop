import path from 'path';
import { isDevelopmentOrTest } from './environment';
import { developmentSettingFolderName } from './fileNames';
import { sourcePath } from './paths';

export const SETTINGS_FOLDER = isDevelopmentOrTest
  ? path.resolve(sourcePath, '..', developmentSettingFolderName)
  : // eslint-disable-next-line @typescript-eslint/no-var-requires
    path.resolve(require('electron').app.getPath('userData'), 'settings');
