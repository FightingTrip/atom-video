import type { GlobalTheme, GlobalThemeOverrides } from 'naive-ui';
export declare const useThemeStore: import("pinia").StoreDefinition<"theme", {
    isDark: boolean;
}, {
    theme(): GlobalTheme;
    themeOverrides(): GlobalThemeOverrides;
}, {
    toggleTheme(): void;
    initTheme(): void;
}>;
