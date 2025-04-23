/**
* @file ContentAnalysisComponent.vue
* @description 内容分析组件，提供视频内容表现统计和优化建议
* @author Atom Video Team
* @date 2025-04-25
*/

<template>
  <div class="content-analysis-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <n-spin size="large" />
      <p>加载内容分析数据中...</p>
      <n-button v-if="error" @click="fetchContentData">重试</n-button>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <n-result status="error" title="数据加载失败" :description="errorMessage">
        <template #footer>
          <n-button @click="fetchContentData">重试</n-button>
        </template>
      </n-result>
    </div>

    <!-- 数据展示 -->
    <div v-else class="content-data">
      <div class="analytics-header">
        <h3 class="analytics-title">{{ title }}</h3>
        <div class="analytics-actions">
          <n-select v-model:value="timeFrame" :options="timeFrameOptions" size="small" style="width: 120px"
            @update:value="handleTimeFrameChange" />
          <n-button type="primary" size="small" @click="exportData">
            <template #icon>
              <n-icon>
                <DownloadOutline />
              </n-icon>
            </template>
            导出数据
          </n-button>
        </div>
      </div>

      <!-- 分类性能对比 -->
      <n-card title="分类性能对比" class="chart-card">
        <div ref="categoryChartRef" class="chart-container"></div>
      </n-card>

      <n-grid :cols="24" :x-gap="16" :y-gap="16">
        <!-- 视频时长性能 -->
        <n-grid-item :span="12">
          <n-card title="视频时长性能" class="chart-card">
            <div ref="durationChartRef" class="chart-container"></div>
          </n-card>
        </n-grid-item>

        <!-- 发布时间分析 -->
        <n-grid-item :span="12">
          <n-card title="最佳发布时间" class="chart-card">
            <n-table :bordered="false" :single-line="false">
              <thead>
                <tr>
                  <th>星期</th>
                  <th>最佳时段</th>
                  <th>表现指数</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in contentData.publishTimeAnalysis" :key="index">
                  <td>{{ item.dayOfWeek }}</td>
                  <td>{{ item.timeOfDay }}</td>
                  <td>
                    <n-progress type="line" :percentage="item.performance" :indicator-placement="'inside'" :height="15"
                      color="#63e2b7" rail-color="#d9f2e7" />
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-card>
        </n-grid-item>
      </n-grid>

      <!-- 表现最佳的视频 -->
      <n-card title="表现最佳的视频" class="chart-card">
        <n-data-table :columns="videoColumns" :data="contentData.topPerformingVideos" :pagination="{ pageSize: 5 }"
          :bordered="false" />
      </n-card>

      <!-- 内容优化建议 -->
      <n-card title="内容优化建议" class="chart-card">
        <n-collapse>
          <n-collapse-item v-for="(tip, index) in contentData.optimizationTips" :key="index" :title="tip.title"
            :name="index">
            <div class="tip-content">
              <p>{{ tip.description }}</p>
              <n-divider />
              <h4>建议措施：</h4>
              <n-list>
                <n-list-item v-for="(action, i) in tip.actionItems" :key="i">
                  <n-thing :title="action" />
                </n-list-item>
              </n-list>
            </div>
          </n-collapse-item>
        </n-collapse>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, onUnmounted, nextTick } from 'vue'
  import { NGrid, NGridItem, NCard, NDataTable, NSpin, NButton, NList, NListItem, NThing, NResult, NSelect, NIcon, NProgress, NTable, NDivider, NCollapse, NCollapseItem } from 'naive-ui'
  import * as echarts from 'echarts/core'
  import { BarChart, LineChart } from 'echarts/charts'
  import { TooltipComponent, LegendComponent, GridComponent, TitleComponent } from 'echarts/components'
  import { CanvasRenderer } from 'echarts/renderers'
  import { DownloadOutline } from '@vicons/ionicons5'
  import { analyticsService, ContentAnalytics } from '@/services/analytics/analyticsService'

  // 注册 ECharts 组件
  echarts.use([
    BarChart, LineChart,
    TooltipComponent, LegendComponent, GridComponent, TitleComponent,
    CanvasRenderer
  ])

  export default defineComponent({
    name: 'ContentAnalysisComponent',

    components: {
      NGrid, NGridItem, NCard, NDataTable, NSpin, NButton, NList, NListItem, NThing, NResult, NSelect, NIcon, NProgress, NTable, NDivider, NCollapse, NCollapseItem
    },

    props: {
      title: {
        type: String,
        default: '内容分析'
      },
      videoId: {
        type: String,
        default: undefined
      }
    },

    setup(props) {
      const loading = ref(true)
      const error = ref(false)
      const errorMessage = ref('')
      const timeFrame = ref<'week' | 'month' | 'quarter' | 'year'>('month')

      const timeFrameOptions = [
        { label: '本周', value: 'week' },
        { label: '本月', value: 'month' },
        { label: '本季度', value: 'quarter' },
        { label: '本年', value: 'year' }
      ]

      const contentData = ref<ContentAnalytics>({
        categoryPerformance: [],
        durationPerformance: [],
        topPerformingVideos: [],
        optimizationTips: [],
        publishTimeAnalysis: []
      })

      const categoryChartRef = ref<HTMLElement | null>(null)
      const durationChartRef = ref<HTMLElement | null>(null)
      let categoryChart: echarts.ECharts | null = null
      let durationChart: echarts.ECharts | null = null

      // 表格列定义
      const videoColumns = [
        { title: '视频标题', key: 'title', width: 300 },
        {
          title: '观看次数',
          key: 'views',
          sorter: true,
          render(row: { views: number }) {
            return formatNumber(row.views)
          }
        },
        {
          title: '留存率(%)',
          key: 'retention',
          sorter: true,
          render(row: { retention: number }) {
            return row.retention + '%'
          }
        },
        {
          title: '互动率(%)',
          key: 'engagement',
          sorter: true,
          render(row: { engagement: number }) {
            return row.engagement + '%'
          }
        },
        {
          title: '收益(¥)',
          key: 'revenue',
          sorter: true,
          render(row: { revenue: number }) {
            return formatCurrency(row.revenue)
          }
        }
      ]

      // 加载数据
      const fetchContentData = async () => {
        loading.value = true
        error.value = false

        try {
          // 使用analyticsService获取数据
          const response = await analyticsService.getContentAnalytics({
            videoId: props.videoId,
            timeFrame: timeFrame.value
          })

          contentData.value = response

          loading.value = false

          // 渲染图表
          nextTick(() => {
            initCharts()
          })
        } catch (err) {
          console.error('加载内容分析数据失败:', err)
          error.value = true
          errorMessage.value = '无法加载内容分析数据，请稍后再试'
          loading.value = false
        }
      }

      // 初始化图表
      const initCharts = () => {
        initCategoryChart()
        initDurationChart()
      }

      // 初始化分类性能图表
      const initCategoryChart = () => {
        if (categoryChartRef.value) {
          if (!categoryChart) {
            categoryChart = echarts.init(categoryChartRef.value)
          }

          const categoryNames = contentData.value.categoryPerformance.map(item => item.category)
          const viewsData = contentData.value.categoryPerformance.map(item => item.totalViews)
          const revenueData = contentData.value.categoryPerformance.map(item => item.totalRevenue)
          const avgRevenueData = contentData.value.categoryPerformance.map(item => item.avgRevenue)

          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['总观看量', '总收益', '平均收益/视频'],
              bottom: 10
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '15%',
              top: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: categoryNames
            },
            yAxis: [
              {
                type: 'value',
                name: '观看量',
                position: 'left'
              },
              {
                type: 'value',
                name: '收益 (¥)',
                position: 'right'
              }
            ],
            series: [
              {
                name: '总观看量',
                type: 'bar',
                yAxisIndex: 0,
                data: viewsData
              },
              {
                name: '总收益',
                type: 'bar',
                yAxisIndex: 1,
                data: revenueData
              },
              {
                name: '平均收益/视频',
                type: 'line',
                yAxisIndex: 1,
                data: avgRevenueData,
                smooth: true,
                lineStyle: {
                  width: 3
                },
                symbol: 'circle',
                symbolSize: 8
              }
            ]
          }

          categoryChart.setOption(option)
        }
      }

      // 初始化时长性能图表
      const initDurationChart = () => {
        if (durationChartRef.value) {
          if (!durationChart) {
            durationChart = echarts.init(durationChartRef.value)
          }

          const durationGroups = contentData.value.durationPerformance.map(item => item.duration)

          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['平均留存率(%)', '平均互动率(%)', '平均收益(¥)'],
              bottom: 10
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '15%',
              top: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: durationGroups
            },
            yAxis: {
              type: 'value',
              name: '百分比/收益'
            },
            series: [
              {
                name: '平均留存率(%)',
                type: 'line',
                data: contentData.value.durationPerformance.map(item => item.avgRetention),
                smooth: true,
                itemStyle: {
                  color: '#6395f9'
                }
              },
              {
                name: '平均互动率(%)',
                type: 'line',
                data: contentData.value.durationPerformance.map(item => item.avgEngagement),
                smooth: true,
                itemStyle: {
                  color: '#62daab'
                }
              },
              {
                name: '平均收益(¥)',
                type: 'line',
                data: contentData.value.durationPerformance.map(item => item.avgRevenue),
                smooth: true,
                itemStyle: {
                  color: '#657798'
                }
              }
            ]
          }

          durationChart.setOption(option)
        }
      }

      // 导出数据
      const exportData = () => {
        const dataStr = JSON.stringify(contentData.value, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

        const exportFileDefaultName = `content-analytics-${new Date().toISOString().slice(0, 10)}.json`

        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
      }

      // 处理窗口大小调整
      const handleResize = () => {
        categoryChart?.resize()
        durationChart?.resize()
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
        fetchContentData()
      }

      onMounted(() => {
        fetchContentData()
        window.addEventListener('resize', handleResize)
      })

      onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
        categoryChart?.dispose()
        durationChart?.dispose()
      })

      return {
        loading,
        error,
        errorMessage,
        contentData,
        categoryChartRef,
        durationChartRef,
        videoColumns,
        fetchContentData,
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
  .content-analysis-container {
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
    .content-analysis-container {
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