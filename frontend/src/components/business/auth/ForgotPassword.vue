/**
* @file ForgotPassword.vue
* @description 忘记密码页面组件，用于用户找回密码
* @author Atom Video Team
* @date 2025-04-06
*
* @features
* - 密码找回：支持通过邮箱找回密码
* - 表单验证：邮箱格式验证
* - 状态提示：显示发送成功/失败状态
* - 自动跳转：发送成功后自动跳转到登录页
* - 响应式设计：适配不同屏幕尺寸
* - 主题适配：支持明暗主题
*
* @dependencies
* - useAuthStore: 认证状态管理
* - naive-ui: UI组件库
* - vue-i18n: 国际化支持
* - vue-router: 路由管理
*/

<template>
  <div class="forgot-password-container">
    <div class="card">
      <h2 class="title">{{ title }}</h2>
      
      <!-- 第一步：输入邮箱 -->
      <div v-if="step === 1">
        <p class="description">请输入您的邮箱地址，我们将向您发送验证码。</p>
        <a-form :model="form" @finish="handleSendCode" layout="vertical">
          <a-form-item
            name="email"
            :rules="[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]"
          >
            <a-input
              v-model:value="form.email"
              placeholder="请输入邮箱"
              size="large"
              :disabled="loading"
            >
              <template #prefix>
                <mail-outlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              block
              size="large"
            >
              发送验证码
            </a-button>
          </a-form-item>
          
          <div class="actions">
            <router-link to="/auth/login">返回登录</router-link>
          </div>
        </a-form>
      </div>

      <!-- 第二步：输入验证码 -->
      <div v-if="step === 2">
        <p class="description">
          验证码已发送到您的邮箱：{{ form.email }}
          <br />
          <a class="resend-link" @click="resendCode" :class="{ disabled: countdown > 0 }">
            {{ countdown > 0 ? `${countdown}秒后可重新发送` : '重新发送验证码' }}
          </a>
        </p>
        
        <a-form :model="form" @finish="handleVerifyCode" layout="vertical">
          <a-form-item
            name="code"
            :rules="[
              { required: true, message: '请输入验证码' },
              { len: 6, message: '验证码长度必须为6位' }
            ]"
          >
            <a-input
              v-model:value="form.code"
              placeholder="请输入6位验证码"
              size="large"
              :disabled="loading"
            >
              <template #prefix>
                <safety-outlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              block
              size="large"
            >
              验证
            </a-button>
          </a-form-item>
          
          <div class="actions">
            <a @click="step = 1">返回</a>
          </div>
        </a-form>
      </div>

      <!-- 第三步：设置新密码 -->
      <div v-if="step === 3">
        <p class="description">请设置您的新密码</p>
        
        <a-form :model="form" @finish="handleResetPassword" layout="vertical">
          <a-form-item
            name="password"
            :rules="[
              { required: true, message: '请输入密码' },
              { min: 8, message: '密码最少8个字符' },
              { 
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
                message: '密码必须包含大小写字母和数字' 
              }
            ]"
          >
            <a-input-password
              v-model:value="form.password"
              placeholder="请输入新密码"
              size="large"
              :disabled="loading"
            >
              <template #prefix>
                <lock-outlined />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item
            name="confirmPassword"
            :rules="[
              { required: true, message: '请确认密码' },
              { validator: validateConfirmPassword }
            ]"
          >
            <a-input-password
              v-model:value="form.confirmPassword"
              placeholder="请再次输入新密码"
              size="large"
              :disabled="loading"
            >
              <template #prefix>
                <lock-outlined />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              block
              size="large"
            >
              重置密码
            </a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- 第四步：重置成功 -->
      <div v-if="step === 4" class="success-container">
        <a-result
          status="success"
          title="密码重置成功"
          sub-title="您已成功重置密码，请使用新密码登录"
        >
          <template #extra>
            <a-button type="primary" @click="gotoLogin">
              返回登录
            </a-button>
          </template>
        </a-result>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import { MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export default defineComponent({
  name: 'ForgotPassword',
  components: {
    MailOutlined,
    LockOutlined,
    SafetyOutlined,
  },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    
    // 表单状态
    const step = ref(1);
    const loading = ref(false);
    const countdown = ref(0);
    const countdownTimer = ref<number | null>(null);
    
    const form = reactive({
      email: '',
      code: '',
      password: '',
      confirmPassword: '',
    });

    // 计算属性
    const title = computed(() => {
      switch (step.value) {
        case 1: return '找回密码';
        case 2: return '验证邮箱';
        case 3: return '设置新密码';
        case 4: return '重置成功';
        default: return '找回密码';
      }
    });

    // 方法
    const startCountdown = () => {
      countdown.value = 60;
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value);
      }
      
      countdownTimer.value = window.setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--;
        } else {
          if (countdownTimer.value) {
            clearInterval(countdownTimer.value);
            countdownTimer.value = null;
          }
        }
      }, 1000);
    };

    const handleSendCode = async () => {
      try {
        loading.value = true;
        
        // 调用 API 发送验证码
        await authStore.requestPasswordReset(form.email);
        
        message.success('验证码已发送到您的邮箱');
        startCountdown();
        step.value = 2;
      } catch (error) {
        console.error('发送验证码失败', error);
        message.error('发送验证码失败，请检查邮箱是否正确');
      } finally {
        loading.value = false;
      }
    };

    const resendCode = async () => {
      if (countdown.value > 0) return;
      
      try {
        loading.value = true;
        
        // 调用 API 重新发送验证码
        await authStore.requestPasswordReset(form.email);
        
        message.success('验证码已重新发送到您的邮箱');
        startCountdown();
      } catch (error) {
        console.error('重新发送验证码失败', error);
        message.error('重新发送验证码失败');
      } finally {
        loading.value = false;
      }
    };

    const handleVerifyCode = async () => {
      try {
        loading.value = true;
        
        // 调用 API 验证验证码
        const isValid = await authStore.verifyCode(form.email, form.code);
        
        if (isValid) {
          step.value = 3;
        } else {
          message.error('验证码无效或已过期');
        }
      } catch (error) {
        console.error('验证码验证失败', error);
        message.error('验证码无效或已过期');
      } finally {
        loading.value = false;
      }
    };

    const validateConfirmPassword = (_rule: any, value: string) => {
      if (value !== form.password) {
        return Promise.reject('两次输入的密码不一致');
      }
      return Promise.resolve();
    };

    const handleResetPassword = async () => {
      try {
        loading.value = true;
        
        // 调用 API 重置密码
        await authStore.resetPasswordWithCode(form.email, form.code, form.password);
        
        message.success('密码重置成功');
        step.value = 4;
      } catch (error) {
        console.error('密码重置失败', error);
        message.error('密码重置失败，请重试');
      } finally {
        loading.value = false;
      }
    };

    const gotoLogin = () => {
      router.push('/auth/login');
    };

    return {
      step,
      loading,
      countdown,
      form,
      title,
      handleSendCode,
      resendCode,
      handleVerifyCode,
      validateConfirmPassword,
      handleResetPassword,
      gotoLogin,
    };
  },
});
</script>

<style scoped>
.forgot-password-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 0 16px;
}

.card {
  background: #1f1f1f;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 24px;
  color: #fff;
}

.description {
  margin-bottom: 24px;
  text-align: center;
  color: #bfbfbf;
}

.actions {
  margin-top: 16px;
  text-align: center;
}

.resend-link {
  color: #1890ff;
  cursor: pointer;
}

.resend-link.disabled {
  color: #595959;
  cursor: not-allowed;
}

.success-container {
  text-align: center;
}
</style>