export declare const useAppStore: import("pinia").StoreDefinition<"app", {
    isSidebarCollapsed: import("@vueuse/shared").RemovableRef<boolean>;
    isDrawerOpen: boolean;
}, {}, {
    toggleSidebar(): void;
    toggleDrawer(): void;
}>;
