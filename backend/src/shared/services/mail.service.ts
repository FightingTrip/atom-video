import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  /**
   * 发送验证码邮件
   * @param to 收件人邮箱
   * @param verificationCode 验证码
   */
  async sendVerificationCode(to: string, verificationCode: string): Promise<void> {
    const subject = 'Atom Video - 验证码';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e88e5;">您的验证码</h2>
        <p>您好，您正在重置密码。请使用以下验证码完成操作：</p>
        <div style="background-color: #f5f5f5; padding: 10px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px;">
          ${verificationCode}
        </div>
        <p>该验证码30分钟内有效。</p>
        <p>如果您没有请求此验证码，请忽略此邮件。</p>
        <p>谢谢,<br>Atom Video 团队</p>
      </div>
    `;

    await this.sendMail(to, subject, html);
  }

  /**
   * 发送密码重置链接邮件
   * @param to 收件人邮箱
   * @param resetLink 重置链接
   */
  async sendPasswordResetLink(to: string, resetLink: string): Promise<void> {
    const subject = 'Atom Video - 密码重置';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e88e5;">密码重置请求</h2>
        <p>您好，您请求重置密码。请点击下面的链接来重置您的密码：</p>
        <p><a href="${resetLink}" style="display: inline-block; background-color: #1e88e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">重置密码</a></p>
        <p>或者复制以下链接到浏览器：</p>
        <p style="word-break: break-all;">${resetLink}</p>
        <p>此链接1小时内有效。</p>
        <p>如果您没有请求重置密码，请忽略此邮件。</p>
        <p>谢谢,<br>Atom Video 团队</p>
      </div>
    `;

    await this.sendMail(to, subject, html);
  }

  /**
   * 发送欢迎邮件
   * @param to 收件人邮箱
   * @param username 用户名
   */
  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    const subject = 'Atom Video - 欢迎加入';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e88e5;">欢迎加入 Atom Video！</h2>
        <p>您好 ${username}，</p>
        <p>感谢您注册 Atom Video。我们很高兴您能加入我们的社区。</p>
        <p>Atom Video 是一个专注于编程教学的视频平台，您可以在这里：</p>
        <ul>
          <li>学习最新的编程技术</li>
          <li>观看高质量的教程视频</li>
          <li>和其他开发者交流经验</li>
        </ul>
        <p>立即开始您的学习之旅吧！</p>
        <p><a href="${this.configService.get<string>('FRONTEND_URL')}" style="display: inline-block; background-color: #1e88e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">访问网站</a></p>
        <p>谢谢,<br>Atom Video 团队</p>
      </div>
    `;

    await this.sendMail(to, subject, html);
  }

  /**
   * 发送邮件基础方法
   */
  private async sendMail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: `"Atom Video" <${this.configService.get<string>('SMTP_FROM')}>`,
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
