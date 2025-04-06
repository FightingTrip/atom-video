import BaseInput from './BaseInput.vue';
export { BaseInput };
declare const _default: {
    BaseInput: {
        new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<{
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
        }> & Readonly<{
            onBlur?: ((event: FocusEvent) => any) | undefined;
            onFocus?: ((event: FocusEvent) => any) | undefined;
            "onUpdate:modelValue"?: ((value: string) => any) | undefined;
        }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
            blur: (event: FocusEvent) => any;
            focus: (event: FocusEvent) => any;
            "update:modelValue": (value: string) => any;
        }, import("vue").PublicProps, {
            id: string;
            type: string;
            disabled: boolean;
            required: boolean;
            autocomplete: string;
        }, false, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly<{
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
        }> & Readonly<{
            onBlur?: ((event: FocusEvent) => any) | undefined;
            onFocus?: ((event: FocusEvent) => any) | undefined;
            "onUpdate:modelValue"?: ((value: string) => any) | undefined;
        }>, {}, {}, {}, {}, {
            id: string;
            type: string;
            disabled: boolean;
            required: boolean;
            autocomplete: string;
        }>;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } & import("vue").ComponentOptionsBase<Readonly<{
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
    }> & Readonly<{
        onBlur?: ((event: FocusEvent) => any) | undefined;
        onFocus?: ((event: FocusEvent) => any) | undefined;
        "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    }>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
        blur: (event: FocusEvent) => any;
        focus: (event: FocusEvent) => any;
        "update:modelValue": (value: string) => any;
    }, string, {
        id: string;
        type: string;
        disabled: boolean;
        required: boolean;
        autocomplete: string;
    }, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & (new () => {
        $slots: {
            prefix?: ((props: {}) => any) | undefined;
            suffix?: ((props: {}) => any) | undefined;
        };
    });
};
export default _default;
