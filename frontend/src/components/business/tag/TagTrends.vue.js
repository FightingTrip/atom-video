/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, onUnmounted } from 'vue';
import api from '@/utils/api';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
const chartRef = ref(null);
const chart = ref(null);
const trends = ref([]);
const fetchTrends = async () => {
    try {
        const response = await api.get('/api/tags/trends');
        if (response.data.success) {
            trends.value = response.data.data;
            updateChart();
        }
    }
    catch (error) {
        console.error('获取标签趋势失败:', error);
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
    const labels = trends.value[0]?.counts.map(item => item.date) || [];
    const datasets = trends.value.map(trend => ({
        label: formatTagName(trend.tag),
        data: trend.counts.map(item => item.count),
        borderColor: getRandomColor(),
        tension: 0.1
    }));
    // 创建新图表
    chart.value = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets
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
                    position: 'right'
                }
            }
        }
    });
};
const formatTagName = (tag) => {
    return tag.toLowerCase().replace(/_/g, ' ');
};
const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
};
onMounted(() => {
    fetchTrends();
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
    ...{ class: "tag-trends" },
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
/** @type {__VLS_StyleScopedClasses['tag-trends']} */ ;
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
//# sourceMappingURL=TagTrends.vue.js.map