import { UserAgentProfile, DeviceConfig } from '../types/browser';

export const USER_AGENT_PROFILES: UserAgentProfile[] = [
  {
    id: 'macos-safari',
    name: 'macOS Safari 18 (Recommended)',
    browser: 'Safari 18.2',
    os: 'macOS Sonoma / Sequoia',
    isDesktop: true,
    userAgentString:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15',
  },
  {
    id: 'windows-chrome',
    name: 'Windows 11 Chrome 134',
    browser: 'Chrome 134.0',
    os: 'Windows 11 64-bit',
    isDesktop: true,
    userAgentString:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  },
  {
    id: 'linux-firefox',
    name: 'Linux Firefox 135',
    browser: 'Firefox 135.0',
    os: 'Ubuntu Linux x86_64',
    isDesktop: true,
    userAgentString:
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0',
  },
  {
    id: 'macos-chrome',
    name: 'macOS Chrome 134',
    browser: 'Chrome 134.0',
    os: 'macOS Sequoia (Apple Silicon)',
    isDesktop: true,
    userAgentString:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  },
  {
    id: 'ios-mobile-safari',
    name: 'iOS 18 Mobile Safari (Default Mobile)',
    browser: 'Mobile Safari 18.0',
    os: 'iOS 18.0 iPhone',
    isDesktop: false,
    userAgentString:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  },
];

export const DEVICE_PROFILES: DeviceConfig[] = [
  {
    id: 'iphone16pro',
    name: 'iPhone 16 Pro',
    width: 393,
    height: 852,
    bezelRadius: 'rounded-[48px]',
    notchType: 'island',
    platform: 'ios',
  },
  {
    id: 'pixel9pro',
    name: 'Pixel 9 Pro',
    width: 412,
    height: 892,
    bezelRadius: 'rounded-[44px]',
    notchType: 'hole',
    platform: 'android',
  },
  {
    id: 's24ultra',
    name: 'Galaxy S24 Ultra',
    width: 412,
    height: 915,
    bezelRadius: 'rounded-[36px]',
    notchType: 'hole',
    platform: 'android',
  },
  {
    id: 'ipadmini',
    name: 'iPad Mini (Compact Tablet)',
    width: 540,
    height: 780,
    bezelRadius: 'rounded-[32px]',
    notchType: 'none',
    platform: 'ios',
  },
];
