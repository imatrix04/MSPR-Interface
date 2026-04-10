/**
 * Theme colors and semantic tokens for light/dark mode.
 * This file is used by useThemeColor() and all themed components.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#ffffff';

export const Colors = {
  light: {
    text: '#030213',
    background: '#ffffff',
    card: '#ffffff',
    cardForeground: '#030213',
    popover: '#f8fafc',
    popoverForeground: '#030213',
    primary: '#030213',
    primaryForeground: '#ffffff',
    secondary: '#eef2ff',
    secondaryForeground: '#030213',
    muted: '#ececf0',
    mutedForeground: '#717182',
    accent: '#e9ebef',
    accentForeground: '#030213',
    destructive: '#d4183d',
    destructiveForeground: '#ffffff',
    border: 'rgba(0, 0, 0, 0.1)',
    input: 'transparent',
    inputBackground: '#f3f3f5',
    switchBackground: '#cbced4',
    ring: '#b3b3b3',
    chart1: '#496a9a',
    chart2: '#4f6d9f',
    chart3: '#6b7da8',
    chart4: '#d9e3b4',
    chart5: '#d7d7c2',
    sidebar: '#ffffff',
    sidebarForeground: '#030213',
    sidebarPrimary: '#030213',
    sidebarPrimaryForeground: '#ffffff',
    sidebarAccent: '#f3f4f6',
    sidebarAccentForeground: '#1f2937',
    sidebarBorder: '#e5e7eb',
    sidebarRing: '#b3b3b3',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F5F5F7',
    background: '#12141A',
    card: '#181c22',
    cardForeground: '#F5F5F7',
    popover: '#181c22',
    popoverForeground: '#F5F5F7',
    primary: '#F8FAFC',
    primaryForeground: '#111827',
    secondary: '#4B5563',
    secondaryForeground: '#F5F5F7',
    muted: '#4B5563',
    mutedForeground: '#CBD5E1',
    accent: '#4B5563',
    accentForeground: '#F5F5F7',
    destructive: '#EF4444',
    destructiveForeground: '#F8FAFC',
    border: '#2A2F38',
    input: '#22272f',
    inputBackground: '#1F2430',
    switchBackground: '#4B5563',
    ring: '#7C818A',
    chart1: '#5F7BB0',
    chart2: '#85A7D1',
    chart3: '#A0B1CE',
    chart4: '#7A83B7',
    chart5: '#8D8E6F',
    sidebar: '#0f172a',
    sidebarForeground: '#F8FAFC',
    sidebarPrimary: '#4F46E5',
    sidebarPrimaryForeground: '#F8FAFC',
    sidebarAccent: '#334155',
    sidebarAccentForeground: '#F8FAFC',
    sidebarBorder: '#1f2937',
    sidebarRing: '#5B6672',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
