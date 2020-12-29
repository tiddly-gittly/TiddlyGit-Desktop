export enum WindowNames {
  main = 'main',
  view = 'view',
  addWorkspace = 'addWorkspace',
}

/**
 * Width height of windows
 */
export const windowDimension: Record<WindowNames, { width?: number; height?: number }> = {
  [WindowNames.main]: {
    width: 1200,
    height: 768,
  },
  [WindowNames.view]: {
    width: undefined,
    height: undefined,
  },
  [WindowNames.addWorkspace]: {
    width: 600,
    height: 800,
  },
};