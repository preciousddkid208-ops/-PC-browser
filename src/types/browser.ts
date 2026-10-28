export type DeviceType = 'iphone16pro' | 'pixel9pro' | 's24ultra' | 'ipadmini' | 'responsive';

export interface DeviceConfig {
  id: DeviceType;
  name: string;
  width: number;
  height: number;
  bezelRadius: string;
  notchType: 'island' | 'hole' | 'none';
  platform: 'ios' | 'android';
}

export interface UserAgentProfile {
  id: string;
  name: string;
  browser: string;
  os: string;
  isDesktop: boolean;
  userAgentString: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  category: 'productivity' | 'news' | 'developer' | 'reference';
}

export interface HistoryEntry {
  id: string;
  title: string;
  url: string;
  timestamp: number;
}

export type PlatformTarget = 'react-native' | 'ios-swift' | 'android-kotlin' | 'flutter';

export interface NativeCodeFile {
  filename: string;
  filepath: string;
  language: string;
  description: string;
  code: string;
}

export interface SetupStep {
  step: number;
  title: string;
  commands?: string[];
  explanation: string;
  notes?: string;
}

export interface PlatformDocumentation {
  platform: PlatformTarget;
  title: string;
  subtitle: string;
  icon: string;
  files: NativeCodeFile[];
  setupGuide: SetupStep[];
  architectureNotes: string[];
}
