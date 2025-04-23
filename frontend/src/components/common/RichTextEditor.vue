/**
* @file RichTextEditor.vue
* @description 简单的富文本编辑器组件，支持基本格式化
* @author Atom Video Team
* @date 2025-04-09
*/

<template>
  <div class="rich-editor-container">
    <div class="editor-toolbar">
      <div class="toolbar-group">
        <n-tooltip trigger="hover" placement="top" :delay="1000">
          <template #trigger>
            <n-button quaternary size="small" class="toolbar-button" :class="{ 'is-active': formats.bold }"
              @click="formatText('bold')">
              <template #icon>
                <n-icon>
                  <TextBold />
                </n-icon>
              </template>
            </n-button>
          </template>
          加粗
        </n-tooltip>

        <n-tooltip trigger="hover" placement="top" :delay="1000">
          <template #trigger>
            <n-button quaternary size="small" class="toolbar-button" :class="{ 'is-active': formats.italic }"
              @click="formatText('italic')">
              <template #icon>
                <n-icon>
                  <TextItalic />
                </n-icon>
              </template>
            </n-button>
          </template>
          斜体
        </n-tooltip>

        <n-tooltip trigger="hover" placement="top" :delay="1000">
          <template #trigger>
            <n-button quaternary size="small" class="toolbar-button" :class="{ 'is-active': formats.link }"
              @click="insertLink">
              <template #icon>
                <n-icon>
                  <LinkOutline />
                </n-icon>
              </template>
            </n-button>
          </template>
          插入链接
        </n-tooltip>
      </div>

      <div class="toolbar-group">
        <mention-picker v-model:value="mentionText" @select="insertMention" />
      </div>
    </div>

    <div class="editor-content" contenteditable="true" ref="editorRef" @input="handleInput" @keydown="handleKeyDown"
      @blur="handleBlur" @mouseup="checkSelection" @focus="onFocus" placeholder="写下你的评论..."></div>

    <n-modal v-model:show="showLinkModal" preset="dialog" title="插入链接" positive-text="确认" negative-text="取消"
      @positive-click="confirmLink" @negative-click="showLinkModal = false">
      <n-form>
        <n-form-item label="链接文本">
          <n-input v-model:value="linkText" placeholder="链接显示的文本" />
        </n-form-item>
        <n-form-item label="URL地址">
          <n-input v-model:value="linkUrl" placeholder="https://example.com" />
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, nextTick, watch } from 'vue';
  import { NButton, NTooltip, NIcon, NModal, NForm, NFormItem, NInput } from 'naive-ui';
  import { TextBold, TextItalic, LinkOutline } from '@vicons/ionicons5';
  import MentionPicker from './MentionPicker.vue';

  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '写下你的评论...'
    },
    maxLength: {
      type: Number,
      default: 1000
    }
  });

  const emit = defineEmits(['update:modelValue', 'blur', 'focus']);

  // 编辑器引用
  const editorRef = ref<HTMLDivElement | null>(null);
  const selection = ref<Range | null>(null);
  const selectionRange = ref<[number, number] | null>(null);

  // 格式状态
  const formats = reactive({
    bold: false,
    italic: false,
    link: false
  });

  // 链接相关
  const showLinkModal = ref(false);
  const linkText = ref('');
  const linkUrl = ref('');

  // @用户相关
  const mentionText = ref('');

  // 初始化编辑器
  onMounted(() => {
    if (editorRef.value) {
      editorRef.value.setAttribute('placeholder', props.placeholder);

      if (props.modelValue) {
        editorRef.value.innerHTML = props.modelValue;
        emit('update:modelValue', props.modelValue);
      }
    }
  });

  // 监听值变化
  watch(() => props.modelValue, (newValue) => {
    if (editorRef.value && newValue !== editorRef.value.innerHTML) {
      editorRef.value.innerHTML = newValue;
    }
  });

  // 处理输入
  const handleInput = () => {
    if (editorRef.value) {
      const content = editorRef.value.innerHTML;
      emit('update:modelValue', content);
    }
  };

  // 格式化文本
  const formatText = (format: 'bold' | 'italic') => {
    if (!editorRef.value) return;

    // 保存当前选区
    saveSelection();

    // 如果有选择文本，则应用格式
    if (selection.value) {
      document.execCommand(format, false);
      restoreSelection();
      handleInput();

      // 更新格式状态
      checkFormats();
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl+B：加粗
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      formatText('bold');
    }

    // Ctrl+I：斜体
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      formatText('italic');
    }

    // Ctrl+K：插入链接
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      insertLink();
    }
  };

  // 检查当前选择的文本格式
  const checkFormats = () => {
    formats.bold = document.queryCommandState('bold');
    formats.italic = document.queryCommandState('italic');
    formats.link = document.queryCommandState('createLink');
  };

  // 保存当前选区
  const saveSelection = () => {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel && sel.getRangeAt && sel.rangeCount) {
        selection.value = sel.getRangeAt(0);
      }
    }
  };

  // 恢复选区
  const restoreSelection = () => {
    if (selection.value) {
      if (window.getSelection) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(selection.value);
        }
      }
    }
  };

  // 检查选择
  const checkSelection = () => {
    saveSelection();
    checkFormats();
  };

  // 插入链接
  const insertLink = () => {
    saveSelection();

    if (selection.value) {
      const selectedText = selection.value.toString();
      linkText.value = selectedText || '链接文本';
      linkUrl.value = 'https://';
      showLinkModal.value = true;
    }
  };

  // 确认链接
  const confirmLink = () => {
    if (!linkUrl.value || !linkText.value) return;

    restoreSelection();

    if (selection.value) {
      // 清除选区中的内容
      selection.value.deleteContents();

      // 创建链接元素
      const a = document.createElement('a');
      a.href = linkUrl.value.startsWith('http') ? linkUrl.value : `https://${linkUrl.value}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = linkText.value;

      // 插入链接
      selection.value.insertNode(a);

      // 重置选区位置
      const range = document.createRange();
      range.selectNodeContents(a);
      range.collapse(false);

      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }

      // 更新内容
      handleInput();
    }

    showLinkModal.value = false;
  };

  // 插入@用户
  const insertMention = (user: any) => {
    if (!editorRef.value) return;

    // 聚焦编辑器
    editorRef.value.focus();

    // 获取当前选区
    saveSelection();

    if (selection.value) {
      // 创建@用户元素
      const userSpan = document.createElement('span');
      userSpan.className = 'mention-user';
      userSpan.setAttribute('data-user-id', user.id);
      userSpan.textContent = `@${user.username}`;
      userSpan.contentEditable = 'false';

      // 插入@用户
      selection.value.insertNode(userSpan);

      // 在@用户后添加空格
      const space = document.createTextNode(' ');
      selection.value.insertNode(space);

      // 重置选区位置
      const range = document.createRange();
      range.selectNodeContents(space);
      range.collapse(false);

      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }

      // 更新内容
      handleInput();
    }
  };

  // 失焦处理
  const handleBlur = () => {
    emit('blur');
  };

  // 焦点处理
  const onFocus = () => {
    emit('focus');
  };

  // 公开方法：获取纯文本内容
  const getPlainText = () => {
    if (editorRef.value) {
      return editorRef.value.textContent || '';
    }
    return '';
  };

  // 公开方法：清空编辑器
  const clear = () => {
    if (editorRef.value) {
      editorRef.value.innerHTML = '';
      emit('update:modelValue', '');
    }
  };

  // 公开方法：聚焦编辑器
  const focus = () => {
    if (editorRef.value) {
      editorRef.value.focus();
    }
  };

  // 暴露组件方法
  defineExpose({
    getPlainText,
    clear,
    focus
  });
</script>

<style scoped>
  .rich-editor-container {
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--bg-color);
  }

  .editor-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--bg-color-secondary);
  }

  .toolbar-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .toolbar-button {
    border-radius: 4px;
  }

  .toolbar-button.is-active {
    background-color: var(--primary-color-hover);
    color: var(--primary-color);
  }

  .editor-content {
    min-height: 100px;
    max-height: 300px;
    padding: 12px;
    outline: none;
    overflow-y: auto;
    line-height: 1.5;
  }

  .editor-content:empty:before {
    content: attr(placeholder);
    color: var(--text-color-placeholder);
  }

  /* @用户样式 */
  :deep(.mention-user) {
    display: inline-block;
    padding: 0 2px;
    background-color: rgba(var(--primary-color-rgb), 0.1);
    color: var(--primary-color);
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
  }

  /* 链接样式 */
  :deep(a) {
    color: var(--primary-color);
    text-decoration: none;
  }

  :deep(a:hover) {
    text-decoration: underline;
  }
</style>