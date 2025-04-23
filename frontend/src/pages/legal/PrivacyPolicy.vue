/**
* @file PrivacyPolicy.vue
* @description 隐私政策页面
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
  <div class="privacy-page">
    <div class="privacy-container">
      <button class="back-button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        返回
      </button>

      <div class="privacy-header">
        <h1 class="privacy-title">隐私政策</h1>
        <p class="privacy-updated">最后更新: 2025年4月1日</p>
      </div>

      <div class="privacy-content">
        <section>
          <h2>1. 引言</h2>
          <p>
            Atom Video（"我们"、"我们的"或"本公司"）非常重视您的隐私。本隐私政策说明了我们如何收集、使用、披露、处理和保护您通过我们的网站、应用程序和相关服务（统称为"服务"）提供给我们的信息。
          </p>
          <p>
            请仔细阅读本隐私政策。使用我们的服务，即表示您同意本隐私政策中描述的做法。
          </p>
        </section>

        <section>
          <h2>2. 我们收集的信息</h2>
          <p>
            我们可能会收集以下类型的信息：
          </p>
          <h3>2.1 您提供的信息</h3>
          <p>
            这包括您在注册账户、创建个人资料、发布内容、参与互动或直接与我们通信时提供的信息：
          </p>
          <ul>
            <li>账户信息：包括姓名、电子邮件地址、用户名和密码</li>
            <li>个人资料信息：包括头像、简介、位置和其他您选择分享的个人信息</li>
            <li>内容：您上传、发布或创建的视频、评论、消息和其他内容</li>
            <li>通信：您与我们的客户支持团队或其他用户的通信内容</li>
          </ul>

          <h3>2.2 自动收集的信息</h3>
          <p>
            当您使用我们的服务时，我们可能会自动收集某些信息：
          </p>
          <ul>
            <li>设备信息：包括设备类型、操作系统、唯一设备标识符、IP地址、移动网络信息</li>
            <li>日志信息：包括浏览历史、搜索查询、访问时间、引荐URL</li>
            <li>位置信息：根据您的IP地址或设备设置收集的大致位置</li>
            <li>使用数据：包括您观看的视频、互动的内容、使用时间和模式</li>
            <li>Cookie和类似技术：用于收集和存储有关您如何使用我们服务的信息</li>
          </ul>

          <h3>2.3 来自第三方的信息</h3>
          <p>
            我们可能会从第三方接收有关您的信息：
          </p>
          <ul>
            <li>社交媒体平台：当您使用社交媒体账户登录时</li>
            <li>合作伙伴：我们可能与分析提供商、广告网络和搜索引擎等合作伙伴合作</li>
          </ul>
        </section>

        <section>
          <h2>3. 信息使用</h2>
          <p>
            我们使用收集到的信息：
          </p>
          <ul>
            <li>提供、维护和改进我们的服务</li>
            <li>创建和维护您的账户</li>
            <li>处理和完成交易</li>
            <li>发送相关信息，包括确认、技术通知、更新、安全警报和支持消息</li>
            <li>个性化内容推荐</li>
            <li>监控和分析服务的使用情况和趋势</li>
            <li>检测、调查和防止欺诈活动和其他非法活动</li>
            <li>保护我们服务的安全和完整性</li>
          </ul>
        </section>

        <section>
          <h2>4. 信息共享</h2>
          <p>
            我们可能在以下情况下共享您的信息：
          </p>
          <ul>
            <li>在您的同意下</li>
            <li>与提供服务的服务提供商和合作伙伴</li>
            <li>为遵守法律义务或响应合法请求</li>
            <li>在业务转让（如合并、收购或资产出售）的情况下</li>
            <li>为保护Atom Video、我们的用户或公众的权利、财产或安全</li>
            <li>以汇总或匿名形式，其中无法合理识别您个人</li>
          </ul>
        </section>

        <section>
          <h2>5. 您的选择和权利</h2>
          <p>
            根据您所在地区适用的数据保护法，您可能拥有以下权利：
          </p>
          <ul>
            <li>访问、更正或删除我们持有的关于您的个人信息</li>
            <li>反对或限制我们处理您的个人信息</li>
            <li>请求我们提供您的个人信息的可移植副本</li>
            <li>撤销您之前给予的同意</li>
          </ul>
          <p>
            要行使这些权利，请通过下面提供的联系信息与我们联系。请注意，某些信息可能因法律和合法业务目的而被保留。
          </p>
        </section>

        <section>
          <h2>6. 安全</h2>
          <p>
            我们实施了合理的安全措施来保护您的个人信息免受未经授权的访问、使用或披露。然而，互联网传输或电子存储不是100%安全的。
            因此，尽管我们努力保护您的个人信息，但我们不能保证其绝对安全。
          </p>
        </section>

        <section>
          <h2>7. 儿童隐私</h2>
          <p>
            我们的服务不面向13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。如果您认为我们可能收集了13岁以下儿童的个人信息，
            请立即联系我们，我们将采取措施删除该信息。
          </p>
        </section>

        <section>
          <h2>8. 国际数据传输</h2>
          <p>
            您的信息可能会传输到并维护在您所在国家/地区以外的计算机上，这些国家/地区的数据保护法可能与您所在司法管辖区的法律不同。
            如果您位于欧洲经济区或英国，请注意，我们可能会将数据转移到这些地区以外的国家。在这种情况下，我们将确保您的个人数据受到适当的保护措施。
          </p>
        </section>

        <section>
          <h2>9. 政策变更</h2>
          <p>
            我们可能会不时更新本隐私政策。我们会在进行重大更改时通知您，例如通过在我们的网站上发布通知或向您发送电子邮件。
            我们鼓励您定期查看本隐私政策，以了解我们如何保护您的信息。
          </p>
        </section>

        <section>
          <h2>10. 联系我们</h2>
          <p>
            如果您对本隐私政策有任何问题或疑虑，请通过 <a href="mailto:privacy@atomvideo.app">privacy@atomvideo.app</a> 联系我们。
          </p>
        </section>
      </div>

      <div class="privacy-footer">
        <p>© 2025 Atom Video. 保留所有权利。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .privacy-page {
    min-height: 100vh;
    background-color: #0f0f0f;
    color: #f5f5f5;
    padding: 20px;
    display: flex;
    justify-content: center;
  }

  .privacy-container {
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

  .privacy-header {
    margin-bottom: 30px;
    border-bottom: 1px solid #333;
    padding-bottom: 20px;
  }

  .privacy-title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .privacy-updated {
    font-size: 14px;
    color: #999;
  }

  .privacy-content {
    line-height: 1.6;
  }

  .privacy-content section {
    margin-bottom: 24px;
  }

  .privacy-content h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #e5e5e5;
  }

  .privacy-content h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #e5e5e5;
  }

  .privacy-content p {
    margin-bottom: 16px;
    color: #bbb;
  }

  .privacy-content ul {
    list-style-type: disc;
    padding-left: 20px;
    margin-bottom: 16px;
    color: #bbb;
  }

  .privacy-content ul li {
    margin-bottom: 8px;
  }

  .privacy-content a {
    color: #3b82f6;
    text-decoration: none;
  }

  .privacy-content a:hover {
    text-decoration: underline;
  }

  .privacy-footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #333;
    text-align: center;
    font-size: 14px;
    color: #888;
  }

  @media (max-width: 768px) {
    .privacy-container {
      padding: 20px;
    }

    .privacy-title {
      font-size: 24px;
    }

    .privacy-content h2 {
      font-size: 18px;
    }

    .privacy-content h3 {
      font-size: 16px;
    }
  }
</style>
