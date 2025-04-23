/**
* @file RevenueAnalysisComponent.vue
* @description 创作者收益分析组件，提供收益统计、预测和优化建议
* @author Atom Video Team
* @date 2025-04-28
*/

<template>
  <div class="revenue-analysis-container">
    <!-- 加载中状态 -->
    <div v-if="loading" class="loading-container">
      <NSpin size="large" />
      <p>数据加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <NIcon size="48">
        <CloseCircleOutline />
      </NIcon>
      <p>{{ errorMessage }}</p>
      <NButton @click="fetchRevenueData">重试</NButton>
    </div>

    <!-- 正常内容显示 -->
    <div v-else>
      <!-- 页面标题和操作区 -->
      <div class="analytics-header">
        <h2 class="analytics-title">收益分析</h2>
        <div class="analytics-actions">
          <NSelect v-model:value="timeFrame" :options="timeFrameOptions" @update:value="handleTimeFrameChange"
            style="width: 120px" />
          <NButton @click="exportData" type="default" size="small">
            <template #icon>
              <NIcon>
                <DownloadOutline />
              </NIcon>
            </template>
            导出数据
          </NButton>
        </div>
      </div>

      <!-- 收益概况卡片 -->
      <NGrid :cols="4" :x-gap="16" responsive="screen" class="revenue-summary">
        <NGi span="4 xl:1">
          <NCard>
            <div class="summary-item">
              <div class="summary-title">总收益</div>
              <div class="summary-value">{{ formatCurrency(revenueData.totalRevenue) }}</div>
              <div class="summary-trend up">
                <NIcon>
                  <TrendingUpOutline />
                </NIcon> 同比增长 {{ revenueData.monthlyGrowth }}%
              </div>
            </div>
          </NCard>
        </NGi>
        <NGi span="4 xl:1">
          <NCard>
            <div class="summary-item">
              <div class="summary-title">预计年收入</div>
              <div class="summary-value">{{ formatCurrency(revenueData.estimatedYearlyRevenue) }}</div>
              <div class="summary-desc">基于当前增长率预测</div>
            </div>
          </NCard>
        </NGi>
        <NGi span="4 xl:1">
          <NCard>
            <div class="summary-item">
              <div class="summary-title">下月预期收入</div>
              <div class="summary-value">{{ formatCurrency(revenueData.predictions.nextMonth) }}</div>
              <div class="summary-desc">较本月增长 5%</div>
            </div>
          </NCard>
        </NGi>
        <NGi span="4 xl:1">
          <NCard>
            <div class="summary-item">
              <div class="summary-title">终身收益</div>
              <div class="summary-value">{{ formatCurrency(revenueData.lifetimeRevenue) }}</div>
              <div class="summary-desc">自频道创建以来</div>
            </div>
          </NCard>
        </NGi>
      </NGrid>

      <!-- 图表区域 -->
      <NCard title="月度收益趋势" class="chart-card">
        <div ref="monthlyChartRef" class="chart-container"></div>
      </NCard>

      <NGrid :cols="2" :x-gap="16" responsive="screen">
        <NGi span="2 xl:1">
          <NCard title="收益来源分布" class="chart-card">
            <div ref="sourceChartRef" class="chart-container"></div>
          </NCard>
        </NGi>
        <NGi span="2 xl:1">
          <NCard title="收益预测" class="chart-card">
            <div ref="predictionChartRef" class="chart-container"></div>
          </NCard>
        </NGi>
      </NGrid>

      <!-- 表格区域 -->
      <NCard title="表现最佳视频" class="chart-card">
        <NDataTable :columns="videoColumns" :data="revenueData.topVideos" :pagination="{ pageSize: 5 }" />
      </NCard>

      <!-- 优化建议 -->
      <NCard title="收益优化建议" class="chart-card">
        <NGrid :cols="2" :x-gap="16" responsive="screen">
          <NGi v-for="(suggestion, index) in revenueData.suggestions" :key="index" span="2 xl:1">
            <div class="tip-content">
              <h4>{{ suggestion.title }}</h4>
              <p>{{ suggestion.description }}</p>
            </div>
          </NGi>
        </NGrid>
      </NCard>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
  import {
    NCard,
    NDataTable,
    NButton,
    NIcon,
    NGrid,
    NGi,
    NSelect,
    DataTableColumns,
    NSpin
  } from 'naive-ui'
  import {
    CloseCircleOutline,
    TrendingUpOutline,
    DownloadOutline
  } from '@vicons/ionicons5'
  import * as echarts from 'echarts/core'
  import { LineChart, PieChart, BarChart } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
  } from 'echarts/components'
  import { CanvasRenderer } from 'echarts/renderers'
  import { analyticsService, RevenueAnalytics } from '@/services/analytics/analyticsService'

  // 注册必要的 echarts 组件
  echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    LineChart,
    PieChart,
    BarChart,
    CanvasRenderer
  ])

  export default defineComponent({
    name: 'RevenueAnalysisComponent',
    components: {
      NCard,
      NDataTable,
      NButton,
      NIcon,
      NGrid,
      NGi,
      NSelect,
      NSpin,
      CloseCircleOutline,
      TrendingUpOutline,
      DownloadOutline
    },
    setup() {
      // 状态
      const loading = ref(true)
      const error = ref(false)
      const errorMessage = ref('')
      const revenueData = ref<RevenueAnalytics>({} as RevenueAnalytics)

      // 图表引用
      const monthlyChartRef = ref<HTMLElement | null>(null)
      const sourceChartRef = ref<HTMLElement | null>(null)
      const predictionChartRef = ref<HTMLElement | null>(null)

      // 图表实例
      let monthlyChart: echarts.ECharts | null = null
      let sourceChart: echarts.ECharts | null = null
      let predictionChart: echarts.ECharts | null = null

      // 时间范围选择
      const timeFrame = ref<'week' | 'month' | 'quarter' | 'year'>('month')
      const timeFrameOptions = [
        { label: '本周', value: 'week' },
        { label: '本月', value: 'month' },
        { label: '本季度', value: 'quarter' },
        { label: '本年', value: 'year' }
      ]

      // DataTable列定义，使用any类型绕过类型检查
      const videoColumns: DataTableColumns = [
        {
          title: '视频标题',
          key: 'title'
        },
        {
          title: '播放量',
          key: 'views',
          render(row: any) {
            return formatNumber(row.views)
          }
        },
        {
          title: '总收益',
          key: 'revenue',
          render(row: any) {
            return formatCurrency(row.revenue)
          }
        },
        {
          title: '单次播放收益',
          key: 'revenuePerView',
          render(row: any) {
            return formatCurrency(row.revenuePerView)
          }
        }
      ]

      // 获取收益数据
      const fetchRevenueData = async () => {
        loading.value = true
        error.value = false
        errorMessage.value = ''

        try {
          revenueData.value = await analyticsService.getRevenueAnalytics({
            timeFrame: timeFrame.value
          })
          initCharts()
        } catch (err: any) {
          error.value = true
          errorMessage.value = err.message || '获取收益数据失败'
        } finally {
          loading.value = false
        }
      }

      // 初始化图表
      const initCharts = () => {
        if (revenueData.value) {
          initMonthlyChart()
          initSourceChart()
          initPredictionChart()
        }
      }

      // 初始化月度收益图表
      const initMonthlyChart = () => {
        if (monthlyChartRef.value) {
          monthlyChart = echarts.init(monthlyChartRef.value)

          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['收益(¥)', '播放量'],
              right: 10,
              top: 10
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: revenueData.value.monthlyData.map(item => item.month)
            },
            yAxis: [
              {
                type: 'value',
                name: '收益(¥)',
                axisLabel: {
                  formatter: '{value} ¥'
                }
              },
              {
                type: 'value',
                name: '播放量',
                axisLabel: {
                  formatter: '{value}'
                }
              }
            ],
            series: [
              {
                name: '收益(¥)',
                type: 'bar',
                data: revenueData.value.monthlyData.map(item => item.revenue),
                itemStyle: {
                  color: '#5470c6'
                }
              },
              {
                name: '播放量',
                type: 'line',
                yAxisIndex: 1,
                data: revenueData.value.monthlyData.map(item => item.views),
                smooth: true,
                itemStyle: {
                  color: '#91cc75'
                }
              }
            ]
          }

          monthlyChart.setOption(option)
        }
      }

      // 初始化收益来源图表
      const initSourceChart = () => {
        if (sourceChartRef.value) {
          sourceChart = echarts.init(sourceChartRef.value)

          const option = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              right: 10,
              top: 'center',
              data: revenueData.value.sources.map(item => item.name)
            },
            series: [
              {
                name: '收益来源',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '18',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: revenueData.value.sources.map(item => ({
                  name: item.name,
                  value: item.value
                }))
              }
            ]
          }

          sourceChart.setOption(option)
        }
      }

      // 初始化预测图表
      const initPredictionChart = () => {
        if (predictionChartRef.value) {
          predictionChart = echarts.init(predictionChartRef.value)

          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: ['下个月', '3个月', '本年度剩余', '下一年度']
            },
            yAxis: {
              type: 'value',
              name: '预计收益(¥)'
            },
            series: [
              {
                name: '预计收益',
                type: 'bar',
                data: [
                  revenueData.value.predictions.nextMonth,
                  revenueData.value.predictions.threeMonths,
                  revenueData.value.predictions.remainingYear,
                  revenueData.value.predictions.nextYear
                ],
                itemStyle: {
                  color: function (params: any) {
                    const colorList = ['#91cc75', '#5470c6', '#fac858', '#ee6666'];
                    return colorList[params.dataIndex];
                  }
                }
              }
            ]
          }

          predictionChart.setOption(option)
        }
      }

      // 导出数据
      const exportData = () => {
        const dataStr = JSON.stringify(revenueData.value, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

        const exportFileDefaultName = `revenue-analytics-${new Date().toISOString().slice(0, 10)}.json`

        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
      }

      // 处理窗口大小调整
      const handleResize = () => {
        monthlyChart?.resize()
        sourceChart?.resize()
        predictionChart?.resize()
      }

      // 格式化货币
      const formatCurrency = (value: number) => {
        return '¥' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
      }

      // 格式化数字
      const formatNumber = (value: number) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }

      // 监听时间范围变化
      const handleTimeFrameChange = () => {
        fetchRevenueData()
      }

      onMounted(() => {
        fetchRevenueData()
        window.addEventListener('resize', handleResize)
      })

      onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
        monthlyChart?.dispose()
        sourceChart?.dispose()
        predictionChart?.dispose()
      })

      return {
        loading,
        error,
        errorMessage,
        revenueData,
        monthlyChartRef,
        sourceChartRef,
        predictionChartRef,
        videoColumns,
        fetchRevenueData,
        formatCurrency,
        formatNumber,
        timeFrame,
        timeFrameOptions,
        handleTimeFrameChange,
        exportData,
        DownloadOutline
      }
    }
  })
</script>

<style scoped>
  .revenue-analysis-container {
    padding: 20px;
    height: 100%;
  }

  .loading-container,
  .error-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .analytics-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .analytics-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  .analytics-actions {
    display: flex;
    gap: 8px;
  }

  .revenue-summary {
    margin-bottom: 16px;
  }

  .summary-item {
    text-align: center;
  }

  .summary-title {
    font-size: 14px;
    color: var(--text-color-secondary, rgba(124, 124, 124, 0.8));
    margin-bottom: 8px;
  }

  .summary-value {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .summary-trend {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .summary-trend.up {
    color: #52c41a;
  }

  .summary-trend.down {
    color: #f5222d;
  }

  .summary-desc {
    font-size: 12px;
    color: var(--text-color-secondary, rgba(124, 124, 124, 0.8));
  }

  .chart-container {
    height: 300px;
    width: 100%;
  }

  .chart-card {
    margin-bottom: 16px;
  }

  .tip-content {
    padding: 16px;
    background-color: var(--container-bg, rgba(250, 250, 252, 0.1));
    border-radius: 8px;
  }

  .tip-content p {
    margin-top: 0;
  }

  .tip-content h4 {
    margin-top: 0;
    margin-bottom: 8px;
  }

  @media (max-width: 768px) {
    .revenue-analysis-container {
      padding: 10px;
    }

    .chart-container {
      height: 250px;
    }

    .analytics-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .analytics-actions {
      width: 100%;
    }
  }
</style>