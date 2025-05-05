/**
* 管理后台个人资料页面
*
* 用于管理员编辑个人资料和账号信息
*/
<template>
  <div class="profile-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">个人资料</h1>
    </div>

    <!-- 资料内容 -->
    <div class="profile-content">
      <div class="profile-layout">
        <!-- 左侧个人信息卡片 -->
        <n-card class="profile-card">
          <div class="profile-info">
            <div class="avatar-container">
              <n-avatar :size="96" :src="profile.avatar" :fallback-src="defaultAvatar" />
              <div class="avatar-uploader">
                <n-upload accept="image/*" :custom-request="uploadAvatar" :show-file-list="false">
                  <n-button size="small" type="primary" circle>
                    <template #icon>
                      <n-icon>
                        <CameraOutline />
                      </n-icon>
                    </template>
                  </n-button>
                </n-upload>
              </div>
            </div>
            <div class="profile-name">{{ profile.displayName || profile.username }}</div>
            <div class="profile-role">
              <n-tag type="primary">{{ profile.role }}</n-tag>
            </div>
            <div class="profile-stats">
              <div class="stat-item">
                <div class="stat-value">{{ profile.lastLogin || '未知' }}</div>
                <div class="stat-label">最近登录</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ loginCount }}</div>
                <div class="stat-label">登录次数</div>
              </div>
            </div>
          </div>
        </n-card>

        <!-- 右侧表单区域 -->
        <n-card title="账号信息" class="details-card">
          <n-tabs type="line" animated>
            <n-tab-pane name="basic" tab="基本信息">
              <n-form ref="basicForm" :model="profile" :rules="basicRules" label-placement="left" label-width="100px"
                require-mark-placement="right-hanging">
                <n-form-item label="用户名" path="username">
                  <n-input v-model:value="profile.username" disabled />
                </n-form-item>
                <n-form-item label="显示名称" path="displayName">
                  <n-input v-model:value="profile.displayName" placeholder="输入显示名称" />
                </n-form-item>
                <n-form-item label="邮箱" path="email" required>
                  <n-input v-model:value="profile.email" placeholder="输入邮箱" />
                </n-form-item>
                <n-form-item label="手机号码" path="phone">
                  <n-input v-model:value="profile.phone" placeholder="输入手机号码" />
                </n-form-item>
                <n-form-item label="个人简介" path="bio">
                  <n-input v-model:value="profile.bio" type="textarea" placeholder="输入个人简介" />
                </n-form-item>
                <n-form-item>
                  <n-button type="primary" @click="saveBasicInfo" :loading="isSaving">
                    保存信息
                  </n-button>
                </n-form-item>
              </n-form>
            </n-tab-pane>

            <n-tab-pane name="security" tab="安全设置">
              <n-space vertical>
                <!-- 修改密码 -->
                <div class="security-section">
                  <div class="section-header">
                    <div>
                      <div class="section-title">修改密码</div>
                      <div class="section-desc">定期更改密码可以提高账号安全性</div>
                    </div>
                    <n-button @click="showPasswordModal = true">
                      修改
                    </n-button>
                  </div>
                </div>

                <!-- 双因素认证 -->
                <div class="security-section">
                  <div class="section-header">
                    <div>
                      <div class="section-title">双因素认证</div>
                      <div class="section-desc">启用双因素认证可以增加账号安全性</div>
                    </div>
                    <n-switch v-model:value="security.twoFactorEnabled" />
                  </div>
                  <div v-if="security.twoFactorEnabled" class="section-content">
                    <n-alert title="双因素认证已启用" type="success">
                      下次登录时将需要使用验证码进行二次验证
                    </n-alert>
                    <div class="two-factor-methods">
                      <n-radio-group v-model:value="security.twoFactorMethod">
                        <n-space vertical>
                          <n-radio value="app">身份验证器应用</n-radio>
                          <n-radio value="sms">短信验证</n-radio>
                          <n-radio value="email">邮箱验证</n-radio>
                        </n-space>
                      </n-radio-group>
                    </div>
                    <n-button size="small" @click="setupTwoFactor">
                      设置
                    </n-button>
                  </div>
                </div>

                <!-- 会话管理 -->
                <div class="security-section">
                  <div class="section-header">
                    <div>
                      <div class="section-title">会话管理</div>
                      <div class="section-desc">管理您当前的登录会话</div>
                    </div>
                    <n-button @click="showSessionsModal = true">
                      查看
                    </n-button>
                  </div>
                </div>

                <!-- 登录记录 -->
                <div class="security-section">
                  <div class="section-header">
                    <div>
                      <div class="section-title">登录记录</div>
                      <div class="section-desc">查看您的登录历史</div>
                    </div>
                    <n-button @click="showLoginHistoryModal = true">
                      查看
                    </n-button>
                  </div>
                </div>
              </n-space>
            </n-tab-pane>

            <n-tab-pane name="notification" tab="通知设置">
              <n-space vertical>
                <n-divider title-placement="left">邮件通知</n-divider>
                <n-checkbox-group v-model:value="notification.email">
                  <n-space vertical>
                    <n-checkbox value="security">安全相关通知（必选）</n-checkbox>
                    <n-checkbox value="updates">系统更新和公告</n-checkbox>
                    <n-checkbox value="activity">账号活动摘要</n-checkbox>
                    <n-checkbox value="comment">评论和回复</n-checkbox>
                  </n-space>
                </n-checkbox-group>

                <n-divider title-placement="left">站内通知</n-divider>
                <n-checkbox-group v-model:value="notification.site">
                  <n-space vertical>
                    <n-checkbox value="security">安全相关通知</n-checkbox>
                    <n-checkbox value="updates">系统更新和公告</n-checkbox>
                    <n-checkbox value="activity">账号活动</n-checkbox>
                    <n-checkbox value="comment">评论和回复</n-checkbox>
                    <n-checkbox value="message">私信</n-checkbox>
                  </n-space>
                </n-checkbox-group>

                <div class="form-actions">
                  <n-button type="primary" @click="saveNotificationSettings" :loading="isSavingNotification">
                    保存设置
                  </n-button>
                </div>
              </n-space>
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </div>
    </div>

    <!-- 修改密码模态框 -->
    <n-modal v-model:show="showPasswordModal" preset="card" title="修改密码" style="width: 500px">
      <n-form ref="passwordForm" :model="passwordData" :rules="passwordRules" label-placement="left"
        label-width="120px">
        <n-form-item label="当前密码" path="currentPassword" required>
          <n-input v-model:value="passwordData.currentPassword" type="password" placeholder="输入当前密码"
            show-password-on="click" />
        </n-form-item>
        <n-form-item label="新密码" path="newPassword" required>
          <n-input v-model:value="passwordData.newPassword" type="password" placeholder="输入新密码"
            show-password-on="click" />
        </n-form-item>
        <n-form-item label="确认新密码" path="confirmPassword" required>
          <n-input v-model:value="passwordData.confirmPassword" type="password" placeholder="再次输入新密码"
            show-password-on="click" />
        </n-form-item>
      </n-form>
      <n-space justify="end">
        <n-button @click="showPasswordModal = false">取消</n-button>
        <n-button type="primary" @click="changePassword" :loading="isChangingPassword">
          确认修改
        </n-button>
      </n-space>
    </n-modal>

    <!-- 会话管理模态框 -->
    <n-modal v-model:show="showSessionsModal" preset="card" title="会话管理" style="width: 800px">
      <div class="sessions-list">
        <n-list bordered>
          <n-list-item v-for="session in sessions" :key="session.id">
            <n-thing :title="`${session.browser} (${session.os})`" :description="session.ip">
              <template #avatar>
                <n-avatar :style="{ backgroundColor: session.current ? '#1890ff' : '#ccc' }">
                  <template #icon>
                    <n-icon>
                      <Desktop />
                    </n-icon>
                  </template>
                </n-avatar>
              </template>
              <template #header-extra>
                <n-tag v-if="session.current" type="success">当前会话</n-tag>
              </template>
              <template #description>
                <div class="session-meta">
                  <div>登录时间: {{ session.loginTime }}</div>
                  <div>最后活动: {{ session.lastActivity }}</div>
                  <div>位置: {{ session.location }}</div>
                </div>
              </template>
              <template #action>
                <n-button v-if="!session.current" type="error" size="small" @click="terminateSession(session.id)">
                  终止会话
                </n-button>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
      </div>
      <n-space justify="end" style="margin-top: 16px;">
        <n-button type="error" @click="terminateAllOtherSessions">
          终止其他所有会话
        </n-button>
      </n-space>
    </n-modal>

    <!-- 登录记录模态框 -->
    <n-modal v-model:show="showLoginHistoryModal" preset="card" title="登录记录" style="width: 800px">
      <n-data-table :columns="loginHistoryColumns" :data="loginHistory" :pagination="{ pageSize: 5 }" />
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { h, ref, reactive, onMounted } from 'vue'
  import {
    NCard,
    NAvatar,
    NButton,
    NIcon,
    NTag,
    NSpace,
    NForm,
    NFormItem,
    NInput,
    NTabs,
    NTabPane,
    NUpload,
    NDivider,
    NCheckbox,
    NCheckboxGroup,
    NRadio,
    NRadioGroup,
    NSwitch,
    NModal,
    NAlert,
    NList,
    NListItem,
    NThing,
    NDataTable,
    useMessage,
    FormInst,
    FormRules,
    DataTableColumns
  } from 'naive-ui'
  import {
    CameraOutline,
    PersonOutline,
    ShieldOutline,
    NotificationsOutline,
    Desktop,
    LogOutOutline,
    LocationOutline,
    TimeOutline,
    AlertCircleOutline
  } from '@vicons/ionicons5'

  // 消息提示
  const message = useMessage()

  // 默认头像
  const defaultAvatar = '/api/images/default-avatar.png'

  // 表单引用
  const basicForm = ref<FormInst | null>(null)
  const passwordForm = ref<FormInst | null>(null)

  // 保存状态
  const isSaving = ref(false)
  const isChangingPassword = ref(false)
  const isSavingNotification = ref(false)

  // 模态框状态
  const showPasswordModal = ref(false)
  const showSessionsModal = ref(false)
  const showLoginHistoryModal = ref(false)

  // 配置文件数据
  const profile = reactive({
    username: 'admin',
    displayName: '系统管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    bio: '系统管理员负责维护和管理整个平台。',
    avatar: '/api/images/avatar.jpg',
    role: '超级管理员',
    lastLogin: '2023-06-18 10:30:45'
  })

  // 登录次数
  const loginCount = ref(128)

  // 基本表单规则
  const basicRules: FormRules = {
    email: [
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
    ],
    phone: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
    ],
    bio: [
      { max: 200, message: '个人简介不能超过200个字符', trigger: 'blur' }
    ]
  }

  // 密码数据
  const passwordData = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // 密码规则
  const passwordRules: FormRules = {
    currentPassword: [
      { required: true, message: '请输入当前密码', trigger: 'blur' }
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      { min: 8, message: '密码长度不能少于8个字符', trigger: 'blur' },
      {
        validator: (_rule, value) => {
          if (!/[A-Z]/.test(value)) return new Error('密码必须包含大写字母')
          if (!/[a-z]/.test(value)) return new Error('密码必须包含小写字母')
          if (!/[0-9]/.test(value)) return new Error('密码必须包含数字')
          if (!/[^A-Za-z0-9]/.test(value)) return new Error('密码必须包含特殊字符')
          return true
        },
        trigger: 'blur'
      }
    ],
    confirmPassword: [
      { required: true, message: '请确认新密码', trigger: 'blur' },
      {
        validator: (_rule, value) => {
          if (value !== passwordData.newPassword) {
            return new Error('两次输入的密码不一致')
          }
          return true
        },
        trigger: 'blur'
      }
    ]
  }

  // 安全设置
  const security = reactive({
    twoFactorEnabled: false,
    twoFactorMethod: 'app'
  })

  // 通知设置
  const notification = reactive({
    email: ['security', 'updates'],
    site: ['security', 'updates', 'message']
  })

  // 会话数据
  const sessions = ref([
    {
      id: 's1',
      browser: 'Chrome 114.0.0.0',
      os: 'Windows 10',
      ip: '192.168.1.100',
      loginTime: '2023-06-18 10:30:45',
      lastActivity: '2023-06-18 14:25:30',
      location: '北京市',
      current: true
    },
    {
      id: 's2',
      browser: 'Firefox 113.0',
      os: 'MacOS',
      ip: '192.168.1.101',
      loginTime: '2023-06-17 18:22:10',
      lastActivity: '2023-06-17 20:15:05',
      location: '上海市',
      current: false
    },
    {
      id: 's3',
      browser: 'Mobile Safari',
      os: 'iOS 16.5',
      ip: '10.0.0.24',
      loginTime: '2023-06-16 09:15:22',
      lastActivity: '2023-06-16 09:45:12',
      location: '广州市',
      current: false
    }
  ])

  // 登录历史列数据
  const createLoginHistoryColumns = (): DataTableColumns<any> => {
    return [
      {
        title: '时间',
        key: 'time',
        sorter: (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      },
      {
        title: '浏览器',
        key: 'browser'
      },
      {
        title: '操作系统',
        key: 'os'
      },
      {
        title: 'IP地址',
        key: 'ip'
      },
      {
        title: '位置',
        key: 'location'
      },
      {
        title: '状态',
        key: 'status',
        render(row) {
          return h(
            NTag,
            {
              type: row.status === '成功' ? 'success' : 'error',
              size: 'small',
            },
            { default: () => row.status }
          )
        }
      }
    ]
  }

  const loginHistoryColumns = createLoginHistoryColumns()

  // 登录历史数据
  const loginHistory = ref([
    {
      time: '2023-06-18 10:30:45',
      browser: 'Chrome 114.0.0.0',
      os: 'Windows 10',
      ip: '192.168.1.100',
      location: '北京市',
      status: '成功'
    },
    {
      time: '2023-06-17 18:22:10',
      browser: 'Firefox 113.0',
      os: 'MacOS',
      ip: '192.168.1.101',
      location: '上海市',
      status: '成功'
    },
    {
      time: '2023-06-16 09:15:22',
      browser: 'Mobile Safari',
      os: 'iOS 16.5',
      ip: '10.0.0.24',
      location: '广州市',
      status: '成功'
    },
    {
      time: '2023-06-15 14:40:33',
      browser: 'Chrome 114.0.0.0',
      os: 'Windows 10',
      ip: '192.168.1.100',
      location: '北京市',
      status: '成功'
    },
    {
      time: '2023-06-14 20:18:51',
      browser: 'Chrome 114.0.0.0',
      os: 'Windows 10',
      ip: '207.142.131.248',
      location: '美国',
      status: '失败'
    },
    {
      time: '2023-06-14 20:15:22',
      browser: 'Chrome 114.0.0.0',
      os: 'Windows 10',
      ip: '207.142.131.248',
      location: '美国',
      status: '失败'
    },
    {
      time: '2023-06-13 16:30:22',
      browser: 'Chrome 113.0.0.0',
      os: 'Windows 10',
      ip: '192.168.1.100',
      location: '北京市',
      status: '成功'
    }
  ])

  // 保存基本信息
  const saveBasicInfo = async () => {
    try {
      await new Promise<void>((resolve, reject) => {
        basicForm.value?.validate(errors => {
          if (errors) {
            reject(new Error('表单验证失败'))
          } else {
            resolve()
          }
        })
      })

      isSaving.value = true

      // 模拟API保存操作
      await new Promise(resolve => setTimeout(resolve, 1000))

      message.success('个人信息保存成功')
    } catch (error) {
      console.error('保存个人信息失败:', error)
      message.error('保存失败，请检查表单填写是否正确')
    } finally {
      isSaving.value = false
    }
  }

  // 上传头像
  const uploadAvatar = ({ file }: any) => {
    // 模拟上传头像
    const reader = new FileReader()
    reader.readAsDataURL(file.file)
    reader.onload = () => {
      profile.avatar = reader.result as string
      message.success('头像上传成功')
    }
    reader.onerror = () => {
      message.error('头像上传失败')
    }
  }

  // 修改密码
  const changePassword = async () => {
    try {
      await new Promise<void>((resolve, reject) => {
        passwordForm.value?.validate(errors => {
          if (errors) {
            reject(new Error('表单验证失败'))
          } else {
            resolve()
          }
        })
      })

      isChangingPassword.value = true

      // 模拟API密码修改操作
      await new Promise(resolve => setTimeout(resolve, 1500))

      message.success('密码修改成功')
      showPasswordModal.value = false

      // 清空表单
      passwordData.currentPassword = ''
      passwordData.newPassword = ''
      passwordData.confirmPassword = ''
    } catch (error) {
      console.error('修改密码失败:', error)
      message.error('修改密码失败，请检查表单填写是否正确')
    } finally {
      isChangingPassword.value = false
    }
  }

  // 设置双因素认证
  const setupTwoFactor = () => {
    message.info('功能开发中，敬请期待')
  }

  // 终止会话
  const terminateSession = (sessionId: string) => {
    // 模拟终止会话操作
    sessions.value = sessions.value.filter(session => session.id !== sessionId)
    message.success('会话已终止')
  }

  // 终止所有其他会话
  const terminateAllOtherSessions = () => {
    // 模拟终止所有其他会话操作
    sessions.value = sessions.value.filter(session => session.current)
    message.success('所有其他会话已终止')
  }

  // 保存通知设置
  const saveNotificationSettings = async () => {
    isSavingNotification.value = true
    try {
      // 模拟API保存操作
      await new Promise(resolve => setTimeout(resolve, 1000))

      message.success('通知设置保存成功')
    } catch (error) {
      console.error('保存通知设置失败:', error)
      message.error('保存失败，请稍后重试')
    } finally {
      isSavingNotification.value = false
    }
  }

  // 获取个人资料
  const fetchProfile = async () => {
    try {
      // 模拟API获取操作
      await new Promise(resolve => setTimeout(resolve, 600))

      // 模拟返回的数据已经设置在初始状态中
    } catch (error) {
      console.error('获取个人资料失败:', error)
      message.error('获取个人资料失败，请刷新页面重试')
    }
  }

  // 初始化
  onMounted(() => {
    fetchProfile()
  })
</script>

<style scoped>
  .profile-page {
    padding: var(--content-padding);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .page-title {
    margin: 0;
    font-size: 24px;
    font-weight: 500;
  }

  .profile-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 20px;
  }

  .profile-card {
    height: fit-content;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px 12px;
  }

  .avatar-container {
    position: relative;
  }

  .avatar-uploader {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .profile-name {
    font-size: 18px;
    font-weight: 500;
  }

  .profile-stats {
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin-top: 16px;
    border-top: 1px solid var(--border-color);
    padding-top: 16px;
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 14px;
    color: var(--text-color-secondary);
  }

  .details-card {
    min-height: 500px;
  }

  .security-section {
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .section-title {
    font-weight: 500;
    margin-bottom: 4px;
  }

  .section-desc {
    font-size: 14px;
    color: var(--text-color-secondary);
  }

  .section-content {
    margin-top: 12px;
    padding: 12px;
    background-color: var(--body-color);
    border-radius: 4px;
  }

  .two-factor-methods {
    margin: 16px 0;
  }

  .form-actions {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
  }

  .session-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  @media (max-width: 768px) {
    .profile-layout {
      grid-template-columns: 1fr;
    }
  }
</style>