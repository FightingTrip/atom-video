/**
* 管理后台站点设置页面
*
* 用于管理员配置网站基本设置
*/
<template>
  <div class="site-settings-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">站点设置</h1>
    </div>

    <!-- 设置表单 -->
    <n-card>
      <n-tabs type="line">
        <n-tab-pane name="basic" tab="基本设置">
          <n-form ref="basicForm" :model="basicSettings" :rules="basicRules" label-placement="left" label-width="120px"
            require-mark-placement="right-hanging">
            <n-form-item label="网站名称" path="siteName" required>
              <n-input v-model:value="basicSettings.siteName" placeholder="输入网站名称" />
            </n-form-item>
            <n-form-item label="网站描述" path="siteDescription">
              <n-input v-model:value="basicSettings.siteDescription" type="textarea" placeholder="输入网站描述" />
            </n-form-item>
            <n-form-item label="网站域名" path="siteDomain" required>
              <n-input v-model:value="basicSettings.siteDomain" placeholder="输入网站域名，如 example.com" />
            </n-form-item>
            <n-form-item label="网站Logo" path="siteLogo">
              <n-upload action="/api/upload" :default-file-list="logoFileList" list-type="image-card" :max="1">
                上传Logo
              </n-upload>
            </n-form-item>
            <n-form-item label="网站图标" path="siteFavicon">
              <n-upload action="/api/upload" :default-file-list="faviconFileList" list-type="image-card" :max="1">
                上传图标
              </n-upload>
            </n-form-item>
            <n-form-item label="网站关键词" path="siteKeywords">
              <n-dynamic-tags v-model:value="basicSettings.siteKeywords" :max="10" />
            </n-form-item>
            <n-form-item label="备案信息" path="siteICP">
              <n-input v-model:value="basicSettings.siteICP" placeholder="输入备案信息" />
            </n-form-item>
            <n-form-item label="版权信息" path="siteCopyright">
              <n-input v-model:value="basicSettings.siteCopyright" placeholder="输入版权信息，如 © 2024 Atom Video" />
            </n-form-item>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="contact" tab="联系信息">
          <n-form ref="contactForm" :model="contactSettings" label-placement="left" label-width="120px">
            <n-form-item label="联系邮箱" path="contactEmail">
              <n-input v-model:value="contactSettings.contactEmail" placeholder="输入联系邮箱" />
            </n-form-item>
            <n-form-item label="客服电话" path="contactPhone">
              <n-input v-model:value="contactSettings.contactPhone" placeholder="输入客服电话" />
            </n-form-item>
            <n-form-item label="公司地址" path="companyAddress">
              <n-input v-model:value="contactSettings.companyAddress" type="textarea" placeholder="输入公司地址" />
            </n-form-item>
            <n-form-item label="工作时间" path="workingHours">
              <n-input v-model:value="contactSettings.workingHours" placeholder="输入工作时间，如 周一至周五 9:00-18:00" />
            </n-form-item>

            <n-divider>社交媒体链接</n-divider>

            <n-form-item v-for="(social, index) in contactSettings.socialMedia" :key="index">
              <n-input-group>
                <n-select v-model:value="social.platform" :options="socialPlatformOptions" style="width: 120px" />
                <n-input v-model:value="social.url" placeholder="输入链接地址" />
                <n-button quaternary circle type="error" @click="removeSocialMedia(index)">
                  <template #icon>
                    <n-icon>
                      <CloseCircleOutline />
                    </n-icon>
                  </template>
                </n-button>
              </n-input-group>
            </n-form-item>

            <n-form-item>
              <n-button @click="addSocialMedia">
                <template #icon>
                  <n-icon>
                    <AddOutline />
                  </n-icon>
                </template>
                添加社交媒体
              </n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="seo" tab="SEO设置">
          <n-form ref="seoForm" :model="seoSettings" label-placement="left" label-width="140px">
            <n-form-item label="Meta标题" path="metaTitle">
              <n-input v-model:value="seoSettings.metaTitle" placeholder="输入Meta标题" />
              <template #help>
                默认使用网站名称。自定义Meta标题可以提高SEO效果。
              </template>
            </n-form-item>
            <n-form-item label="Meta描述" path="metaDescription">
              <n-input v-model:value="seoSettings.metaDescription" type="textarea" placeholder="输入Meta描述" />
              <template #help>
                默认使用网站描述。建议在160个字符以内。
              </template>
            </n-form-item>
            <n-form-item label="规范链接" path="canonicalUrl">
              <n-input v-model:value="seoSettings.canonicalUrl" placeholder="输入规范链接，如 https://example.com" />
              <template #help>
                设置网站的规范URL，避免重复内容问题。
              </template>
            </n-form-item>
            <n-form-item label="robots.txt" path="robotsTxt">
              <n-input v-model:value="seoSettings.robotsTxt" type="textarea" placeholder="输入robots.txt内容" :rows="5" />
              <template #help>
                控制搜索引擎爬虫的抓取行为。
              </template>
            </n-form-item>
            <n-form-item label="站点地图URL" path="sitemapUrl">
              <n-input v-model:value="seoSettings.sitemapUrl" placeholder="输入站点地图URL" />
              <template #help>
                XML站点地图URL，帮助搜索引擎抓取网站内容。
              </template>
            </n-form-item>
            <n-form-item label="结构化数据" path="structuredData">
              <n-switch v-model:value="seoSettings.structuredData.enabled" />
              <template #help>
                启用JSON-LD结构化数据，提升搜索结果展示效果。
              </template>
            </n-form-item>
            <n-form-item label="社交分享图片" path="ogImage">
              <n-upload action="/api/upload" :default-file-list="ogImageFileList" list-type="image-card" :max="1">
                上传图片
              </n-upload>
              <template #help>
                当网站内容分享到社交媒体时显示的图片，推荐尺寸1200x630像素。
              </template>
            </n-form-item>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="content" tab="内容设置">
          <n-form ref="contentForm" :model="contentSettings" label-placement="left" label-width="160px">
            <n-form-item label="允许上传的视频格式" path="allowedVideoFormats">
              <n-select v-model:value="contentSettings.allowedVideoFormats" multiple placeholder="选择允许上传的视频格式"
                :options="videoFormatOptions" />
            </n-form-item>
            <n-form-item label="最大视频文件大小" path="maxVideoSize">
              <n-input-number v-model:value="contentSettings.maxVideoSize" min="1" :step="1">
                <template #suffix>MB</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="内容审核" path="contentReview">
              <n-radio-group v-model:value="contentSettings.contentReview">
                <n-space>
                  <n-radio :value="0">无需审核，直接发布</n-radio>
                  <n-radio :value="1">仅新用户需要审核</n-radio>
                  <n-radio :value="2">所有内容都需要审核</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="评论设置" path="commentSettings">
              <n-checkbox-group v-model:value="contentSettings.commentSettings">
                <n-space vertical>
                  <n-checkbox value="allowAnonymous">允许匿名评论</n-checkbox>
                  <n-checkbox value="reviewBeforePublish">评论需要审核</n-checkbox>
                  <n-checkbox value="allowReplies">允许回复评论</n-checkbox>
                  <n-checkbox value="allowVotes">允许评论投票</n-checkbox>
                </n-space>
              </n-checkbox-group>
            </n-form-item>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="user" tab="用户设置">
          <n-form ref="userForm" :model="userSettings" label-placement="left" label-width="160px">
            <n-form-item label="用户注册" path="registration">
              <n-radio-group v-model:value="userSettings.registration">
                <n-space>
                  <n-radio :value="0">允许注册</n-radio>
                  <n-radio :value="1">邀请码注册</n-radio>
                  <n-radio :value="2">关闭注册</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="注册默认角色" path="defaultRole">
              <n-select v-model:value="userSettings.defaultRole" :options="roleOptions" />
            </n-form-item>
            <n-form-item label="验证方式" path="verificationMethods">
              <n-checkbox-group v-model:value="userSettings.verificationMethods">
                <n-space vertical>
                  <n-checkbox value="email">邮箱验证</n-checkbox>
                  <n-checkbox value="mobile">手机验证</n-checkbox>
                </n-space>
              </n-checkbox-group>
            </n-form-item>
            <n-form-item label="用户头像" path="avatar">
              <n-radio-group v-model:value="userSettings.avatar">
                <n-space>
                  <n-radio :value="0">禁止上传头像</n-radio>
                  <n-radio :value="1">审核后显示</n-radio>
                  <n-radio :value="2">直接显示</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="实名认证" path="realNameVerification">
              <n-switch v-model:value="userSettings.realNameVerification" />
            </n-form-item>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="security" tab="安全设置">
          <n-form ref="securityForm" :model="securitySettings" label-placement="left" label-width="160px">
            <n-form-item label="登录失败锁定阈值" path="loginFailThreshold">
              <n-input-number v-model:value="securitySettings.loginFailThreshold" :min="3" :max="10" />
            </n-form-item>
            <n-form-item label="锁定时间" path="lockDuration">
              <n-input-number v-model:value="securitySettings.lockDuration" :min="5" :max="60">
                <template #suffix>分钟</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="会话超时时间" path="sessionTimeout">
              <n-input-number v-model:value="securitySettings.sessionTimeout" :min="30" :max="1440">
                <template #suffix>分钟</template>
              </n-input-number>
            </n-form-item>
            <n-form-item label="密码策略" path="passwordPolicy">
              <div class="sub-form">
                <n-form-item label="最小长度" path="passwordPolicy.minLength">
                  <n-input-number v-model:value="securitySettings.passwordPolicy.minLength" :min="6" :max="32" />
                </n-form-item>
                <n-form-item label="复杂度要求" path="passwordPolicy.complexity">
                  <n-checkbox-group v-model:value="securitySettings.passwordPolicy.complexity">
                    <n-space vertical>
                      <n-checkbox value="uppercase">必须包含大写字母</n-checkbox>
                      <n-checkbox value="lowercase">必须包含小写字母</n-checkbox>
                      <n-checkbox value="numbers">必须包含数字</n-checkbox>
                      <n-checkbox value="symbols">必须包含特殊字符</n-checkbox>
                    </n-space>
                  </n-checkbox-group>
                </n-form-item>
                <n-form-item label="密码过期时间" path="passwordPolicy.expiryDays">
                  <n-input-number v-model:value="securitySettings.passwordPolicy.expiryDays" :min="0" :max="365">
                    <template #suffix>天 (0表示永不过期)</template>
                  </n-input-number>
                </n-form-item>
              </div>
            </n-form-item>
            <n-form-item label="开启双因素验证" path="enableTwoFactor">
              <n-switch v-model:value="securitySettings.enableTwoFactor" />
            </n-form-item>
          </n-form>
        </n-tab-pane>
      </n-tabs>

      <div class="form-actions">
        <n-space justify="end">
          <n-button @click="resetForm">重置</n-button>
          <n-button type="primary" @click="saveSettings" :loading="isSaving">保存设置</n-button>
        </n-space>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import {
    NCard,
    NTabs,
    NTabPane,
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NSelect,
    NSwitch,
    NRadio,
    NRadioGroup,
    NCheckbox,
    NCheckboxGroup,
    NUpload,
    NDynamicTags,
    NSpace,
    NButton,
    NInputGroup,
    NDivider,
    NIcon,
    FormInst,
    FormRules,
    UploadFileInfo,
    useMessage
  } from 'naive-ui'
  import {
    AddOutline,
    CloseCircleOutline
  } from '@vicons/ionicons5'

  // 消息提示
  const message = useMessage()

  // 表单引用
  const basicForm = ref<FormInst | null>(null)
  const contactForm = ref<FormInst | null>(null)
  const contentForm = ref<FormInst | null>(null)
  const userForm = ref<FormInst | null>(null)
  const securityForm = ref<FormInst | null>(null)
  const seoForm = ref<FormInst | null>(null)

  // 保存状态
  const isSaving = ref(false)

  // 基本设置
  const basicSettings = reactive({
    siteName: 'Atom Video',
    siteDescription: '一个高质量的视频分享平台',
    siteLogo: '',
    siteFavicon: '',
    siteKeywords: ['视频', '分享', '创作'],
    siteICP: '',
    siteDomain: '',
    siteCopyright: ''
  })

  // 基本设置验证规则
  const basicRules: FormRules = {
    siteName: [
      { required: true, message: '请输入网站名称', trigger: 'blur' },
      { max: 50, message: '网站名称不能超过50个字符', trigger: 'blur' }
    ],
    siteDescription: [
      { max: 200, message: '网站描述不能超过200个字符', trigger: 'blur' }
    ],
    siteDomain: [
      { required: true, message: '请输入网站域名', trigger: 'blur' },
      { pattern: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, message: '请输入有效的域名', trigger: 'blur' }
    ]
  }

  // Logo和图标文件列表
  const logoFileList = ref<UploadFileInfo[]>([
    {
      id: 'logo',
      name: 'logo.png',
      status: 'finished',
      url: '/api/images/logo.png'
    }
  ])

  const faviconFileList = ref<UploadFileInfo[]>([
    {
      id: 'favicon',
      name: 'favicon.ico',
      status: 'finished',
      url: '/api/images/favicon.ico'
    }
  ])

  // 内容设置
  const contentSettings = reactive({
    allowedVideoFormats: ['mp4', 'mov', 'avi'],
    maxVideoSize: 500,
    contentReview: 1,
    commentSettings: ['allowReplies', 'allowVotes']
  })

  // 视频格式选项
  const videoFormatOptions = [
    { label: 'MP4', value: 'mp4' },
    { label: 'MOV', value: 'mov' },
    { label: 'AVI', value: 'avi' },
    { label: 'FLV', value: 'flv' },
    { label: 'WEBM', value: 'webm' },
    { label: 'MKV', value: 'mkv' }
  ]

  // 用户设置
  const userSettings = reactive({
    registration: 0,
    defaultRole: 'USER',
    verificationMethods: ['email'],
    avatar: 2,
    realNameVerification: false
  })

  // 角色选项
  const roleOptions = [
    { label: '普通用户', value: 'USER' },
    { label: '创作者', value: 'CREATOR' }
  ]

  // 安全设置
  const securitySettings = reactive({
    loginFailThreshold: 5,
    lockDuration: 30,
    sessionTimeout: 120,
    passwordPolicy: {
      minLength: 8,
      complexity: ['numbers', 'lowercase'],
      expiryDays: 0
    },
    enableTwoFactor: false
  })

  // 联系信息设置
  const contactSettings = reactive({
    contactEmail: '',
    contactPhone: '',
    companyAddress: '',
    workingHours: '',
    socialMedia: [
      { platform: 'twitter', url: '' }
    ]
  })

  // 社交媒体平台选项
  const socialPlatformOptions = [
    { label: 'Twitter', value: 'twitter' },
    { label: 'Facebook', value: 'facebook' },
    { label: 'Instagram', value: 'instagram' },
    { label: 'YouTube', value: 'youtube' },
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'GitHub', value: 'github' },
    { label: '微博', value: 'weibo' },
    { label: '微信', value: 'wechat' },
    { label: '抖音', value: 'tiktok' },
    { label: '知乎', value: 'zhihu' }
  ]

  // 添加社交媒体
  const addSocialMedia = () => {
    contactSettings.socialMedia.push({ platform: 'twitter', url: '' })
  }

  // 删除社交媒体
  const removeSocialMedia = (index: number) => {
    contactSettings.socialMedia.splice(index, 1)
  }

  // SEO设置
  const seoSettings = reactive({
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    robotsTxt: 'User-agent: *\nAllow: /',
    sitemapUrl: '',
    structuredData: {
      enabled: false,
      type: 'WebSite'
    }
  })

  // 社交分享图片文件列表
  const ogImageFileList = ref<UploadFileInfo[]>([])

  // 重置表单
  const resetForm = () => {
    // 显示确认对话框
    if (window.confirm('确定要重置所有设置吗？这将会丢失所有未保存的更改。')) {
      fetchSettings()
    }
  }

  // 保存设置
  const saveSettings = async () => {
    try {
      // 验证所有表单
      await new Promise<void>((resolve, reject) => {
        basicForm.value?.validate(errors => {
          if (errors) {
            reject(new Error('基本设置验证失败'))
          } else {
            resolve()
          }
        })
      })

      // 验证联系信息表单
      await new Promise<void>((resolve, reject) => {
        contactForm.value?.validate(errors => {
          if (errors) {
            reject(new Error('联系信息验证失败'))
          } else {
            resolve()
          }
        })
      })

      // 验证SEO设置表单
      await new Promise<void>((resolve, reject) => {
        seoForm.value?.validate(errors => {
          if (errors) {
            reject(new Error('SEO设置验证失败'))
          } else {
            resolve()
          }
        })
      })

      isSaving.value = true

      // 模拟API保存操作
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 构建设置对象
      const settings = {
        basic: basicSettings,
        contact: contactSettings,
        content: contentSettings,
        user: userSettings,
        security: securitySettings,
        seo: seoSettings
      }

      // 保存到后端（模拟）
      console.log('保存设置:', settings)

      message.success('设置保存成功')
    } catch (error) {
      console.error('保存设置失败:', error)
      message.error('保存设置失败，请检查表单是否填写正确')
    } finally {
      isSaving.value = false
    }
  }

  // 获取设置
  const fetchSettings = async () => {
    try {
      // 模拟API获取操作
      await new Promise(resolve => setTimeout(resolve, 600))

      // 模拟返回的设置数据
      const data = {
        basic: {
          siteName: 'Atom Video',
          siteDescription: '一个高质量的视频分享平台',
          siteLogo: '/api/images/logo.png',
          siteFavicon: '/api/images/favicon.ico',
          siteKeywords: ['视频', '分享', '创作'],
          siteICP: '',
          siteDomain: 'example.com',
          siteCopyright: '© 2024 Atom Video'
        },
        contact: {
          contactEmail: 'contact@example.com',
          contactPhone: '400-123-4567',
          companyAddress: '北京市海淀区中关村大街1号',
          workingHours: '周一至周五 9:00-18:00',
          socialMedia: [
            { platform: 'twitter', url: 'https://twitter.com/atomvideo' },
            { platform: 'github', url: 'https://github.com/atomvideo' }
          ]
        },
        seo: {
          metaTitle: 'Atom Video - 高质量视频分享平台',
          metaDescription: '发现、观看和分享高质量的技术视频，提升你的专业技能',
          canonicalUrl: 'https://example.com',
          robotsTxt: 'User-agent: *\nAllow: /',
          sitemapUrl: 'https://example.com/sitemap.xml',
          structuredData: {
            enabled: true,
            type: 'WebSite'
          }
        },
        content: {
          allowedVideoFormats: ['mp4', 'mov', 'avi'],
          maxVideoSize: 500,
          contentReview: 1,
          commentSettings: ['allowReplies', 'allowVotes']
        },
        user: {
          registration: 0,
          defaultRole: 'USER',
          verificationMethods: ['email'],
          avatar: 2,
          realNameVerification: false
        },
        security: {
          loginFailThreshold: 5,
          lockDuration: 30,
          sessionTimeout: 120,
          passwordPolicy: {
            minLength: 8,
            complexity: ['numbers', 'lowercase'],
            expiryDays: 0
          },
          enableTwoFactor: false
        }
      }

      // 更新表单数据
      Object.assign(basicSettings, data.basic)
      Object.assign(contactSettings, data.contact)
      Object.assign(seoSettings, data.seo)
      Object.assign(contentSettings, data.content)
      Object.assign(userSettings, data.user)
      Object.assign(securitySettings, data.security)

      // 更新文件列表
      logoFileList.value = [
        {
          id: 'logo',
          name: 'logo.png',
          status: 'finished',
          url: data.basic.siteLogo
        }
      ]

      faviconFileList.value = [
        {
          id: 'favicon',
          name: 'favicon.ico',
          status: 'finished',
          url: data.basic.siteFavicon
        }
      ]

      // 设置OG图片
      if (data.seo.ogImage) {
        ogImageFileList.value = [
          {
            id: 'ogImage',
            name: 'og-image.png',
            status: 'finished',
            url: data.seo.ogImage
          }
        ]
      }

    } catch (error) {
      console.error('获取设置失败:', error)
      message.error('获取设置失败，请刷新页面重试')
    }
  }

  // 初始化
  onMounted(() => {
    fetchSettings()
  })
</script>

<style scoped>
  .site-settings-page {
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

  .form-actions {
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);
  }

  .sub-form {
    padding-left: 16px;
    margin-top: 8px;
    border-left: 1px solid var(--border-color);
  }
</style>