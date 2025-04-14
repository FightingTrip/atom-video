<template>
  <a-modal
    v-model:open="visible"
    :title="title"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
    :closable="true"
    :maskClosable="false"
    :width="400"
  >
    <div class="verification-dialog">
      <div v-if="!codeVerified">
        <p class="mb-4">请输入发送到 <strong>{{ email }}</strong> 的验证码</p>
        
        <a-form layout="vertical">
          <a-form-item
            label="验证码"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <a-input
              v-model:value="verificationCode"
              placeholder="输入6位数验证码"
              :maxlength="6"
              autocomplete="off"
              size="large"
              class="code-input"
            />
          </a-form-item>
        </a-form>
        
        <div class="resend-link">
          <span v-if="countdown > 0">{{ countdown }}秒后可重新发送</span>
          <a v-else @click="resendCode">重新发送验证码</a>
        </div>
      </div>
      
      <div v-else class="verification-success">
        <div class="success-icon">
          <check-circle-outlined />
        </div>
        <p>验证码验证成功！</p>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue';
import { useToast } from '@/composables/useToast';
import { CheckCircleOutlined } from '@ant-design/icons-vue';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '邮箱验证'
  },
  email: {
    type: String,
    required: true
  }
});

const emits = defineEmits(['update:open', 'verified', 'cancel']);

const visible = computed({
  get: () => props.open,
  set: (value) => emits('update:open', value)
});

const authStore = useAuthStore();
const toast = useToast();

const verificationCode = ref('');
const loading = ref(false);
const countdown = ref(0);
const codeVerified = ref(false);
let countdownTimer: number | null = null;

// 处理确认按钮
const handleOk = async () => {
  if (!verificationCode.value) {
    toast.error('请输入验证码');
    return;
  }
  
  loading.value = true;
  try {
    const isValid = await authStore.verifyCode(props.email, verificationCode.value);
    if (isValid) {
      codeVerified.value = true;
      setTimeout(() => {
        emits('verified', verificationCode.value);
      }, 1000);
    } else {
      toast.error('验证码无效，请重试');
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || '验证失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 处理取消按钮
const handleCancel = () => {
  verificationCode.value = '';
  codeVerified.value = false;
  emits('cancel');
};

// 重新发送验证码
const resendCode = async () => {
  if (countdown.value > 0) return;
  
  loading.value = true;
  try {
    await authStore.requestPasswordReset(props.email);
    toast.success('验证码已重新发送');
    startCountdown();
  } catch (error: any) {
    toast.error(error.response?.data?.message || '发送验证码失败，请重试');
  } finally {
    loading.value = false;
  }
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

// 初始化倒计时
startCountdown();

// 组件销毁前清除定时器
onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
.verification-dialog {
  text-align: center;
  padding: 10px 0;
}

.code-input {
  letter-spacing: 2px;
  text-align: center;
  font-size: 16px;
}

.resend-link {
  margin-top: 16px;
  color: #999;
}

.verification-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.success-icon {
  font-size: 48px;
  color: #52c41a;
  margin-bottom: 16px;
}
</style> 