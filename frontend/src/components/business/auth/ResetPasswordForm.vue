<template>
  <div class="reset-password-form">
    <h2 class="form-title">重置密码</h2>
    
    <div v-if="step === 'email'" class="step-container">
      <a-form :model="formState" layout="vertical">
        <a-form-item 
          label="邮箱" 
          name="email"
          :rules="[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]"
        >
          <a-input 
            v-model:value="formState.email" 
            placeholder="请输入您的邮箱地址"
            size="large" 
          />
        </a-form-item>
        
        <a-form-item>
          <a-button 
            type="primary" 
            size="large" 
            :loading="loading" 
            block 
            @click="requestReset"
          >
            发送验证码
          </a-button>
        </a-form-item>
      </a-form>
      
      <div class="form-footer">
        <router-link to="/login">返回登录</router-link>
      </div>
    </div>
    
    <div v-if="step === 'verify'" class="step-container">
      <p class="mb-4">验证码已发送到您的邮箱 <strong>{{ formState.email }}</strong></p>
      
      <a-form :model="formState" layout="vertical">
        <a-form-item 
          label="验证码" 
          name="code"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <a-input 
            v-model:value="formState.code" 
            placeholder="输入6位数验证码" 
            :maxlength="6"
            autocomplete="off"
            size="large"
            class="code-input"
          />
        </a-form-item>
        
        <a-form-item
          label="新密码" 
          name="password"
          :rules="[
            { required: true, message: '请输入新密码' },
            { min: 8, message: '密码长度不能少于8个字符' }
          ]"
        >
          <a-input-password 
            v-model:value="formState.password" 
            placeholder="请输入新密码"
            size="large"
          />
        </a-form-item>
        
        <a-form-item
          label="确认密码" 
          name="confirmPassword"
          :rules="[
            { required: true, message: '请确认新密码' },
            { validator: validateConfirmPassword }
          ]"
        >
          <a-input-password 
            v-model:value="formState.confirmPassword" 
            placeholder="请再次输入新密码"
            size="large"
          />
        </a-form-item>
        
        <a-form-item>
          <a-button 
            type="primary" 
            size="large" 
            :loading="loading" 
            block 
            @click="resetPassword"
          >
            重置密码
          </a-button>
        </a-form-item>
      </a-form>
      
      <div class="resend-link">
        <span v-if="countdown > 0">{{ countdown }}秒后可重新发送</span>
        <a v-else @click="requestReset">重新发送验证码</a>
      </div>
      
      <div class="form-footer">
        <a @click="backToEmail">返回上一步</a>
      </div>
    </div>
    
    <div v-if="step === 'success'" class="step-container success-container">
      <div class="success-icon">
        <check-circle-filled />
      </div>
      <h3>密码重置成功</h3>
      <p>您的密码已成功重置，请使用新密码登录。</p>
      <a-button type="primary" size="large" @click="goToLogin">
        前往登录
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import { CheckCircleFilled } from '@ant-design/icons-vue';

type Step = 'email' | 'verify' | 'success';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const step = ref<Step>('email');
const loading = ref(false);
const countdown = ref(0);
let countdownTimer: number | null = null;

const formState = reactive({
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
});

// 密码确认验证
const validateConfirmPassword = (_rule: any, value: string) => {
  if (value === '') {
    return Promise.reject('请确认密码');
  }
  if (value !== formState.password) {
    return Promise.reject('两次输入的密码不一致');
  }
  return Promise.resolve();
};

// 请求重置密码
const requestReset = async () => {
  if (!formState.email) {
    toast.error('请输入邮箱地址');
    return;
  }
  
  loading.value = true;
  try {
    await authStore.requestPasswordReset(formState.email);
    toast.success('验证码已发送到您的邮箱');
    step.value = 'verify';
    startCountdown();
  } catch (error: any) {
    toast.error(error.response?.data?.message || '发送验证码失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 重置密码
const resetPassword = async () => {
  if (!formState.code || !formState.password || !formState.confirmPassword) {
    toast.error('请填写所有必填字段');
    return;
  }
  
  if (formState.password !== formState.confirmPassword) {
    toast.error('两次输入的密码不一致');
    return;
  }
  
  loading.value = true;
  try {
    await authStore.resetPasswordWithCode(
      formState.email,
      formState.code,
      formState.password
    );
    step.value = 'success';
  } catch (error: any) {
    toast.error(error.response?.data?.message || '重置密码失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 返回邮箱输入步骤
const backToEmail = () => {
  step.value = 'email';
  formState.code = '';
  formState.password = '';
  formState.confirmPassword = '';
};

// 前往登录页面
const goToLogin = () => {
  router.push('/login');
};

// 倒计时
const startCountdown = () => {
  countdown.value = 60;
  
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
  
  countdownTimer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else if (countdownTimer) {
      clearInterval(countdownTimer);
    }
  }, 1000);
};

// 组件销毁前清除定时器
onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
.reset-password-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 30px 20px;
}

.form-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 500;
}

.step-container {
  animation: fadeIn 0.3s ease-in-out;
}

.code-input {
  letter-spacing: 2px;
  text-align: center;
  font-size: 16px;
}

.resend-link {
  text-align: center;
  margin-top: 16px;
  color: #999;
}

.form-footer {
  text-align: center;
  margin-top: 16px;
}

.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 0;
}

.success-icon {
  font-size: 64px;
  color: #52c41a;
  margin-bottom: 16px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 