export declare const useI18nStore: import("pinia").StoreDefinition<"i18n", {
    locale: string;
}, {
    currentLocale(): string;
    isZhCN(): boolean;
}, {
    setLocale(locale: string): void;
    initLocale(): void;
}>;
