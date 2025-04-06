/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, onUnmounted } from 'vue';
import api from '@/utils/api';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
const chartRef = ref(null);
const chart = ref(null);
const stats = ref([]);
const fetchStats = async () => {
    try {
        const response = await api.get('/api/tags/stats');
        if (response.data.success) {
            stats.value = response.data.data;
            updateChart();
        }
    }
    catch (error) {
        console.error('获取标签统计失败:', error);
    }
};
const updateChart = () => {
    if (!chartRef.value)
        return;
    // 销毁现有图表
    if (chart.value) {
        chart.value.destroy();
    }
    const ctx = chartRef.value.getContext('2d');
    if (!ctx)
        return;
    // 准备数据
    const labels = stats.value.map(stat => formatTagName(stat.tag));
    const data = stats.value.map(stat => stat.count);
    // 创建新图表
    chart.value = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: '视频数量',
                    data,
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
};
const formatTagName = (tag) => {
    return tag.toLowerCase().replace(/_/g, ' ');
};
onMounted(() => {
    fetchStats();
});
onUnmounted(() => {
    if (chart.value) {
        chart.value.destroy();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "tag-stats" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "text-xl font-bold mb-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "chart-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.canvas, __VLS_intrinsicElements.canvas)({
    ref: "chartRef",
});
/** @type {typeof __VLS_ctx.chartRef} */ ;
/** @type {__VLS_StyleScopedClasses['tag-stats']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-container']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            chartRef: chartRef,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=TagStats.vue.js.map