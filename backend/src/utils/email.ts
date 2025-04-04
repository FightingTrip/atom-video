import nodemailer from 'nodemailer';

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 发送验证邮件
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || 'Atom Video <noreply@atomvideo.com>',
    to: email,
    subject: '验证您的 Atom Video 账号',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">欢迎加入 Atom Video</h2>
        <p>感谢您注册 Atom Video 账号。请点击下面的按钮验证您的邮箱：</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            验证邮箱
          </a>
        </div>
        <p>如果按钮无法点击，请复制以下链接到浏览器打开：</p>
        <p style="word-break: break-all;">${verificationUrl}</p>
        <p>如果您没有注册 Atom Video 账号，请忽略此邮件。</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
        <p style="color: #6B7280; font-size: 14px;">此邮件由系统自动发送，请勿回复。</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('发送验证邮件错误:', error);
    throw new Error('发送验证邮件失败');
  }
};

// 发送重置密码邮件
export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || 'Atom Video <noreply@atomvideo.com>',
    to: email,
    subject: '重置您的 Atom Video 账号密码',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">重置密码</h2>
        <p>我们收到您重置密码的请求。请点击下面的按钮重置您的密码：</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            重置密码
          </a>
        </div>
        <p>如果按钮无法点击，请复制以下链接到浏览器打开：</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>如果您没有请求重置密码，请忽略此邮件。</p>
        <p>注意：此链接将在1小时后失效。</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;">
        <p style="color: #6B7280; font-size: 14px;">此邮件由系统自动发送，请勿回复。</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('发送重置密码邮件错误:', error);
    throw new Error('发送重置密码邮件失败');
  }
};
