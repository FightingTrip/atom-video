/**
* @file TermsOfService.vue
* @description 服务条款页面
* @author Atom Video Team
*/

<script setup lang="ts">
  import { useRouter } from 'vue-router';

  const router = useRouter();

  // 返回上一页
  const goBack = () => {
    router.back();
  };
</script>

<template>
  <div class="terms-page">
    <div class="terms-container">
      <button class="back-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        返回
      </button>

      <div class="terms-header">
        <h1 class="terms-title">服务条款</h1>
        <p class="terms-updated">最后更新: 2025年4月1日</p>
      </div>

      <div class="terms-content">
        <section>
          <h2>1. 接受条款</h2>
          <p>
            欢迎使用Atom Video! 这些服务条款（"条款"）规定了使用我们的视频分享服务的规则和限制。请仔细阅读这些条款。
            通过访问或使用我们的服务，您同意受这些条款的约束。如果您不同意这些条款，请不要使用我们的服务。
          </p>
        </section>

        <section>
          <h2>2. 服务描述</h2>
          <p>
            Atom Video是一个视频分享平台，允许用户上传、分享、观看视频内容，并与其他用户互动。我们可能随时更改、暂停或
            终止服务的任何方面，恕不另行通知。
          </p>
        </section>

        <section>
          <h2>3. 用户账户</h2>
          <p>
            要使用某些功能，您需要创建一个账户。您负责维护您账户的安全，包括保护您的密码和限制对您账户的访问。
            您同意对您账户下发生的所有活动负责。
          </p>
          <p>
            您必须向我们提供准确、完整和最新的注册信息。您不得冒充他人或提供虚假信息。我们保留验证您提供的任何信息的权利。
          </p>
        </section>

        <section>
          <h2>4. 用户内容</h2>
          <p>
            我们的服务允许您上传、发布、发送、接收和存储内容。当您上传内容时，您仍然拥有该内容的所有权利。
            但是，通过上传内容，您授予我们非独占、全球、免版税、可转让、可再许可的许可，以使用、复制、修改、创建衍生作品、
            分发、公开展示和执行您的内容，以提供和改进我们的服务。
          </p>
          <p>
            您对您上传、发布或以其他方式通过服务提供的所有内容全权负责。您确认并同意您上传或分享的内容：
          </p>
          <ul>
            <li>不侵犯任何第三方权利</li>
            <li>不包含非法、欺诈、欺骗、威胁、骚扰、诽谤或令人反感的材料</li>
            <li>不包含任何恶意代码、病毒或可能影响我们服务运行的程序</li>
            <li>遵守所有适用的法律法规</li>
          </ul>
        </section>

        <section>
          <h2>5. 服务规则</h2>
          <p>
            使用我们的服务时，您同意不会：
          </p>
          <ul>
            <li>违反任何法律或法规</li>
            <li>发送垃圾邮件或进行网络钓鱼活动</li>
            <li>干扰服务的正常运行</li>
            <li>尝试未经授权访问任何部分的服务</li>
            <li>规避我们服务的任何限制</li>
            <li>使用任何自动化系统或机器人访问服务，除非得到我们明确许可</li>
          </ul>
        </section>

        <section>
          <h2>6. 服务变更与终止</h2>
          <p>
            我们可能随时修改、暂停或终止我们的服务或您对服务的访问，恕不另行通知。
            我们可能会根据我们的自由裁量权，删除或禁止访问您上传或分享的任何内容。
          </p>
        </section>

        <section>
          <h2>7. 免责声明</h2>
          <p>
            我们的服务按"原样"和"可用"基础提供，没有任何形式的明示或暗示保证。我们不保证服务将满足您的要求、
            不间断、安全或无错误。
          </p>
        </section>

        <section>
          <h2>8. 责任限制</h2>
          <p>
            在法律允许的最大范围内，Atom Video及其关联公司、董事、员工或代理人在任何情况下均不对您或任何第三方因使用或
            无法使用我们的服务而导致的任何间接、偶然、特殊、惩罚性或后果性损害负责。
          </p>
        </section>

        <section>
          <h2>9. 条款修改</h2>
          <p>
            我们保留随时修改这些条款的权利。修改后的条款将在发布时立即生效。继续使用我们的服务表示您接受修改后的条款。
          </p>
        </section>

        <section>
          <h2>10. 联系我们</h2>
          <p>
            如果您对这些条款有任何问题或疑虑，请通过 <a href="mailto:legal@atomvideo.app">legal@atomvideo.app</a> 联系我们。
          </p>
        </section>
      </div>

      <div class="terms-footer">
        <p>© 2025 Atom Video. 保留所有权利。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .terms-page {
    min-height: 100vh;
    background-color: #0f0f0f;
    color: #f5f5f5;
    padding: 20px;
    display: flex;
    justify-content: center;
  }

  .terms-container {
    max-width: 800px;
    width: 100%;
    padding: 30px;
    background-color: #181818;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    padding: 8px 0;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .back-button:hover {
    text-decoration: underline;
  }

  .terms-header {
    margin-bottom: 30px;
    border-bottom: 1px solid #333;
    padding-bottom: 20px;
  }

  .terms-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .terms-updated {
    font-size: 14px;
    color: #999;
  }

  .terms-content {
    line-height: 1.6;
  }

  .terms-content section {
    margin-bottom: 24px;
  }

  .terms-content h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #e5e5e5;
  }

  .terms-content p {
    margin-bottom: 16px;
    color: #bbb;
  }

  .terms-content ul {
    list-style-type: disc;
    padding-left: 20px;
    margin-bottom: 16px;
    color: #bbb;
  }

  .terms-content ul li {
    margin-bottom: 8px;
  }

  .terms-content a {
    color: #3b82f6;
    text-decoration: none;
  }

  .terms-content a:hover {
    text-decoration: underline;
  }

  .terms-footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #333;
    text-align: center;
    font-size: 14px;
    color: #888;
  }

  @media (max-width: 768px) {
    .terms-container {
      padding: 20px;
    }

    .terms-title {
      font-size: 24px;
    }

    .terms-content h2 {
      font-size: 18px;
    }
  }
</style>