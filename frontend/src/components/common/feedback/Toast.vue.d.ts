interface Toast {
    id: number;
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message: string;
    duration?: number;
}
type __VLS_Props = {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    addToast: (toast: Omit<Toast, "id">) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
