// Modelo para AppVersionScreen
export interface AppVersionScreenModel {
  currentVersion: string;
  latestVersion: string;
  isUpdateAvailable: boolean;
  lastChecked: string;
  changelog: string[];
  isCheckingForUpdate: boolean;
  updateError: string | null;
}

export const initialAppVersionScreenState: AppVersionScreenModel = {
  currentVersion: '1.0.0',
  latestVersion: '1.0.0',
  isUpdateAvailable: false,
  lastChecked: new Date().toISOString(),
  changelog: [],
  isCheckingForUpdate: false,
  updateError: null,
};

export type AppVersionScreenAction = 
  | { type: 'CHECKING_FOR_UPDATE' }
  | { type: 'UPDATE_AVAILABLE'; payload: { latestVersion: string; changelog: string[] } }
  | { type: 'NO_UPDATE_AVAILABLE' }
  | { type: 'UPDATE_ERROR'; payload: string };
