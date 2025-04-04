import type { Directive } from 'vue';

export const prerender: Directive = {
  mounted(el, binding) {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 当元素进入视口时执行绑定的函数
          if (typeof binding.value === 'function') {
            binding.value();
          }
          // 停止观察
          observer.unobserve(el);
        }
      });
    }, options);

    observer.observe(el);
  },
};
