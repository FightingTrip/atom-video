import { 
// create 方法
create, 
// 必要组件
NConfigProvider, NMessageProvider, NButton, NDropdown, NSpin, NResult, NBackTop, 
// 其他可能需要的组件
NInput, NSpace, NTag, NAvatar, NDivider, NMenu, NIcon, NForm, NFormItem, NModal, NSelect, NLayout, NLayoutSider, NLayoutHeader, NLayoutFooter, NLayoutContent, } from 'naive-ui';
// 创建 naive-ui 实例
const naive = create({
    components: [
        NConfigProvider,
        NMessageProvider,
        NButton,
        NDropdown,
        NSpin,
        NResult,
        NBackTop,
        NInput,
        NSpace,
        NTag,
        NAvatar,
        NDivider,
        NMenu,
        NIcon,
        NForm,
        NFormItem,
        NModal,
        NSelect,
        NLayout,
        NLayoutSider,
        NLayoutHeader,
        NLayoutFooter,
        NLayoutContent,
    ],
});
export default naive;
//# sourceMappingURL=naive.js.map