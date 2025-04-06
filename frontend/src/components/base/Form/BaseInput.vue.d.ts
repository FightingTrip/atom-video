type __VLS_Props = {
    modelValue: string;
    label?: string;
    placeholder?: string;
    type?: string;
    id?: string;
    error?: string;
    hint?: string;
    disabled?: boolean;
    required?: boolean;
    autocomplete?: string;
};
declare const updateValue: (event: Event) => void;
declare const onBlur: (event: FocusEvent) => void;
declare const onFocus: (event: FocusEvent) => void;
declare const __VLS_ctx: InstanceType<__VLS_PickNotAny<typeof __VLS_self, new () => {}>>;
declare var __VLS_1: {}, __VLS_3: {};
type __VLS_Slots = __VLS_PrettifyGlobal<__VLS_OmitStringIndex<typeof __VLS_ctx.$slots> & {
    prefix?: (props: typeof __VLS_1) => any;
} & {
    suffix?: (props: typeof __VLS_3) => any;
}>;
declare const __VLS_self: import("vue").DefineComponent<__VLS_Props, {
    updateValue: typeof updateValue;
    onBlur: typeof onBlur;
    onFocus: typeof onFocus;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    blur: (event: FocusEvent) => any;
    focus: (event: FocusEvent) => any;
    "update:modelValue": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    id: string;
    type: string;
    disabled: boolean;
    required: boolean;
    autocomplete: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    blur: (event: FocusEvent) => any;
    focus: (event: FocusEvent) => any;
    "update:modelValue": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    id: string;
    type: string;
    disabled: boolean;
    required: boolean;
    autocomplete: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
