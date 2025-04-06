/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUser } from '@/composables/useUser';
import Avatar from '@/components/common/avatar/Avatar.vue';
import Button from '@/components/common/button/Button.vue';
import Input from '@/components/common/input/Input.vue';
import Textarea from '@/components/common/textarea/Textarea.vue';
import Checkbox from '@/components/common/checkbox/Checkbox.vue';
import ErrorMessage from '@/components/common/feedback/ErrorMessage.vue';
const router = useRouter();
// 状态
const loading = ref(false);
const error = ref(null);
const form = ref({
    username: '',
    bio: '',
    avatarUrl: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
        email: true,
        push: true,
    },
});
const errors = ref({
    username: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
});
// 组合式函数
const { fetchUserProfile, updateUserProfile, updatePassword, deleteAccount } = useUser();
// 方法
const handleAvatarUpload = () => {
    // TODO: 实现头像上传功能
};
const validateForm = () => {
    let isValid = true;
    errors.value = {
        username: '',
        bio: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    };
    // 用户名验证
    if (!form.value.username) {
        errors.value.username = '请输入用户名';
        isValid = false;
    }
    // 个人简介验证
    if (form.value.bio.length > 200) {
        errors.value.bio = '个人简介不能超过200个字符';
        isValid = false;
    }
    // 密码验证
    if (form.value.newPassword) {
        if (!form.value.currentPassword) {
            errors.value.currentPassword = '请输入当前密码';
            isValid = false;
        }
        if (form.value.newPassword.length < 8) {
            errors.value.newPassword = '新密码不能少于8个字符';
            isValid = false;
        }
        if (form.value.newPassword !== form.value.confirmPassword) {
            errors.value.confirmPassword = '两次输入的密码不一致';
            isValid = false;
        }
    }
    return isValid;
};
const handleSave = async () => {
    if (!validateForm())
        return;
    try {
        loading.value = true;
        error.value = null;
        // 更新用户信息
        await updateUserProfile({
            username: form.value.username,
            bio: form.value.bio,
            avatarUrl: form.value.avatarUrl,
        });
        // 更新密码
        if (form.value.newPassword) {
            await updatePassword({
                currentPassword: form.value.currentPassword,
                newPassword: form.value.newPassword,
            });
        }
        // 更新通知设置
        await updateUserProfile({
            notifications: form.value.notifications,
        });
        router.push('/profile');
    }
    catch (err) {
        error.value = '保存设置失败';
        console.error('保存设置失败:', err);
    }
    finally {
        loading.value = false;
    }
};
const handleDeleteAccount = async () => {
    if (!confirm('确定要删除账号吗？此操作不可恢复。'))
        return;
    try {
        loading.value = true;
        error.value = null;
        await deleteAccount();
        router.push('/login');
    }
    catch (err) {
        error.value = '删除账号失败';
        console.error('删除账号失败:', err);
    }
    finally {
        loading.value = false;
    }
};
// 初始化
onMounted(async () => {
    try {
        loading.value = true;
        error.value = null;
        const user = await fetchUserProfile();
        form.value = {
            username: user.username,
            bio: user.bio || '',
            avatarUrl: user.avatarUrl,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            notifications: user.notifications || {
                email: true,
                push: true,
            },
        };
    }
    catch (err) {
        error.value = '加载用户信息失败';
        console.error('加载用户信息失败:', err);
    }
    finally {
        loading.value = false;
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['user-settings']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['settings-section']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-settings" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "settings-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "username",
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(Input, new Input({
    id: "username",
    modelValue: (__VLS_ctx.form.username),
    error: (__VLS_ctx.errors.username),
    placeholder: "请输入用户名",
}));
const __VLS_1 = __VLS_0({
    id: "username",
    modelValue: (__VLS_ctx.form.username),
    error: (__VLS_ctx.errors.username),
    placeholder: "请输入用户名",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "bio",
});
/** @type {[typeof Textarea, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(Textarea, new Textarea({
    id: "bio",
    modelValue: (__VLS_ctx.form.bio),
    error: (__VLS_ctx.errors.bio),
    placeholder: "请输入个人简介",
    maxlength: (200),
}));
const __VLS_4 = __VLS_3({
    id: "bio",
    modelValue: (__VLS_ctx.form.bio),
    error: (__VLS_ctx.errors.bio),
    placeholder: "请输入个人简介",
    maxlength: (200),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "avatar",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "avatar-upload" },
});
/** @type {[typeof Avatar, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(Avatar, new Avatar({
    src: (__VLS_ctx.form.avatarUrl),
    size: (100),
}));
const __VLS_7 = __VLS_6({
    src: (__VLS_ctx.form.avatarUrl),
    size: (100),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (__VLS_ctx.handleAvatarUpload)
};
__VLS_11.slots.default;
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "settings-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "currentPassword",
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(Input, new Input({
    id: "currentPassword",
    modelValue: (__VLS_ctx.form.currentPassword),
    type: "password",
    error: (__VLS_ctx.errors.currentPassword),
    placeholder: "请输入当前密码",
}));
const __VLS_17 = __VLS_16({
    id: "currentPassword",
    modelValue: (__VLS_ctx.form.currentPassword),
    type: "password",
    error: (__VLS_ctx.errors.currentPassword),
    placeholder: "请输入当前密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "newPassword",
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(Input, new Input({
    id: "newPassword",
    modelValue: (__VLS_ctx.form.newPassword),
    type: "password",
    error: (__VLS_ctx.errors.newPassword),
    placeholder: "请输入新密码",
}));
const __VLS_20 = __VLS_19({
    id: "newPassword",
    modelValue: (__VLS_ctx.form.newPassword),
    type: "password",
    error: (__VLS_ctx.errors.newPassword),
    placeholder: "请输入新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "confirmPassword",
});
/** @type {[typeof Input, ]} */ ;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent(Input, new Input({
    id: "confirmPassword",
    modelValue: (__VLS_ctx.form.confirmPassword),
    type: "password",
    error: (__VLS_ctx.errors.confirmPassword),
    placeholder: "请再次输入新密码",
}));
const __VLS_23 = __VLS_22({
    id: "confirmPassword",
    modelValue: (__VLS_ctx.form.confirmPassword),
    type: "password",
    error: (__VLS_ctx.errors.confirmPassword),
    placeholder: "请再次输入新密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "settings-section" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "checkbox-label" },
});
/** @type {[typeof Checkbox, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(Checkbox, new Checkbox({
    modelValue: (__VLS_ctx.form.notifications.email),
}));
const __VLS_26 = __VLS_25({
    modelValue: (__VLS_ctx.form.notifications.email),
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "checkbox-label" },
});
/** @type {[typeof Checkbox, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(Checkbox, new Checkbox({
    modelValue: (__VLS_ctx.form.notifications.push),
}));
const __VLS_29 = __VLS_28({
    modelValue: (__VLS_ctx.form.notifications.push),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "actions" },
});
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    loading: (__VLS_ctx.loading),
}));
const __VLS_32 = __VLS_31({
    ...{ 'onClick': {} },
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_34;
let __VLS_35;
let __VLS_36;
const __VLS_37 = {
    onClick: (__VLS_ctx.handleSave)
};
__VLS_33.slots.default;
var __VLS_33;
/** @type {[typeof Button, typeof Button, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(Button, new Button({
    ...{ 'onClick': {} },
    type: "danger",
}));
const __VLS_39 = __VLS_38({
    ...{ 'onClick': {} },
    type: "danger",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
let __VLS_41;
let __VLS_42;
let __VLS_43;
const __VLS_44 = {
    onClick: (__VLS_ctx.handleDeleteAccount)
};
__VLS_40.slots.default;
var __VLS_40;
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "error-container" },
    });
    /** @type {[typeof ErrorMessage, ]} */ ;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent(ErrorMessage, new ErrorMessage({
        message: (__VLS_ctx.error),
    }));
    const __VLS_46 = __VLS_45({
        message: (__VLS_ctx.error),
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
}
/** @type {__VLS_StyleScopedClasses['user-settings']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['settings-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['avatar-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['settings-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['settings-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-label']} */ ;
/** @type {__VLS_StyleScopedClasses['actions']} */ ;
/** @type {__VLS_StyleScopedClasses['error-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Avatar: Avatar,
            Button: Button,
            Input: Input,
            Textarea: Textarea,
            Checkbox: Checkbox,
            ErrorMessage: ErrorMessage,
            loading: loading,
            error: error,
            form: form,
            errors: errors,
            handleAvatarUpload: handleAvatarUpload,
            handleSave: handleSave,
            handleDeleteAccount: handleDeleteAccount,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=UserSettings.vue.js.map