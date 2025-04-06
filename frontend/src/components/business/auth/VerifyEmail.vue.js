/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/utils/api';
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);
const error = ref('');
const success = ref('');
// 验证邮箱
const verifyEmail = async (token) => {
    try {
        const response = await api.post('/auth/verify-email', { token });
        success.value = '邮箱验证成功！';
        setTimeout(() => {
            router.push('/auth/login');
        }, 2000);
    }
    catch (err) {
        error.value = err.response?.data?.message || '验证失败，请重试';
    }
};
// 重新发送验证邮件
const resendVerificationEmail = async () => {
    isLoading.value = true;
    error.value = '';
    success.value = '';
    try {
        await api.post('/auth/resend-verification');
        success.value = '验证邮件已重新发送，请查收';
    }
    catch (err) {
        error.value = err.response?.data?.message || '发送失败，请重试';
    }
    finally {
        isLoading.value = false;
    }
};
onMounted(() => {
    const token = route.query.token;
    if (token) {
        verifyEmail(token);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['error-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['success-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['error-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['success-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['success-message']} */ ;
/** @type {__VLS_StyleScopedClasses['resend-button']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-email-link']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "verify-email" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "verify-email-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "verify-email-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "verify-email-desc" },
});
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-alert" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-alert-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-alert-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "error-icon" },
        viewBox: "0 0 20 20",
        fill: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'fill-rule': "evenodd",
        d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
        'clip-rule': "evenodd",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-alert-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.error);
}
if (__VLS_ctx.success) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "success-alert" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "success-alert-content" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "success-alert-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "success-icon" },
        viewBox: "0 0 20 20",
        fill: "currentColor",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
        'fill-rule': "evenodd",
        d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
        'clip-rule': "evenodd",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "success-alert-text" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "success-message" },
    });
    (__VLS_ctx.success);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "verify-email-content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "verify-email-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "verify-email-text" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "verify-email-actions" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.handleResend) },
    type: "button",
    disabled: (__VLS_ctx.isLoading),
    ...{ class: "resend-button" },
    ...{ class: ({ 'button-disabled': __VLS_ctx.isLoading }) },
});
(__VLS_ctx.isLoading ? '发送中...' : '重新发送验证邮件');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "verify-email-footer" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "verify-email-text" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/auth/login",
    ...{ class: "verify-email-link" },
}));
const __VLS_2 = __VLS_1({
    to: "/auth/login",
    ...{ class: "verify-email-link" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['verify-email']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-email-container']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-email-title']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-email-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['error-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['error-alert-content']} */ ;
/** @type {__VLS_StyleScopedClasses['error-alert-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['error-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['error-alert-text']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['success-alert']} */ ;
/** @type {__VLS_StyleScopedClasses['success-alert-content']} */ ;
/** @type {__VLS_StyleScopedClasses['success-alert-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['success-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['success-alert-text']} */ ;
/** @type {__VLS_StyleScopedClasses['success-message']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-email-content']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-email-text']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-email-text']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-email-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['resend-button']} */ ;
/** @type {__VLS_StyleScopedClasses['button-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-email-footer']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-email-text']} */ ;
/** @type {__VLS_StyleScopedClasses['verify-email-link']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            isLoading: isLoading,
            error: error,
            success: success,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=VerifyEmail.vue.js.map