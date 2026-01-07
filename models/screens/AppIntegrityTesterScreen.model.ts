// Modelo para AppIntegrityTesterScreen
export interface AppIntegrityTesterScreenModel {
  isRooted: boolean;
  isEmulator: boolean;
  isDebugging: boolean;
  isTampered: boolean;
  isHooked: boolean;
  isRunningInCloud: boolean;
  isReverseEngineeringToolsPresent: boolean;
  lastChecked: string;
  securityScore: number;
  securityIssues: string[];
}

export const initialAppIntegrityTesterScreenState: AppIntegrityTesterScreenModel = {
  isRooted: false,
  isEmulator: false,
  isDebugging: false,
  isTampered: false,
  isHooked: false,
  isRunningInCloud: false,
  isReverseEngineeringToolsPresent: false,
  lastChecked: new Date().toISOString(),
  securityScore: 100,
  securityIssues: [],
};

export type AppIntegrityTesterScreenAction = 
  | { type: 'UPDATE_SECURITY_STATUS'; payload: Partial<Omit<AppIntegrityTesterScreenModel, 'lastChecked'>> }
  | { type: 'ADD_SECURITY_ISSUE'; payload: string };
