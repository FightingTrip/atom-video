import { ref, onMounted, onUnmounted } from 'vue';
export function useBreakpoint() {
    const breakpoint = ref('xs');
    const getBreakpoint = (width) => {
        if (width < 640)
            return 'xs';
        if (width < 768)
            return 'sm';
        if (width < 1024)
            return 'md';
        if (width < 1280)
            return 'lg';
        return 'xl';
    };
    const updateBreakpoint = () => {
        breakpoint.value = getBreakpoint(window.innerWidth);
    };
    onMounted(() => {
        updateBreakpoint();
        window.addEventListener('resize', updateBreakpoint);
    });
    onUnmounted(() => {
        window.removeEventListener('resize', updateBreakpoint);
    });
    return {
        breakpoint,
    };
}
//# sourceMappingURL=useBreakpoint.js.map