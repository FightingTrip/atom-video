import { h } from 'vue';

export function renderIcon(icon: string) {
  return () => h('i', { class: icon });
}
