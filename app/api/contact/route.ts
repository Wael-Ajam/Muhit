import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, organization, phone, email, service, brief, budget, deadline } = body;

    // Create transporter — using Muhit's email SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.muhitsolution.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'info@muhitsolution.com',
        pass: process.env.SMTP_PASS || '',
      },
    });

    // Email content
    const htmlContent = `
      <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1f; color: white; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #F97316, #EA580C); padding: 24px 32px;">
          <h1 style="margin: 0; font-size: 24px; color: white;">🚀 طلب مشروع جديد</h1>
        </div>
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #F97316; font-weight: bold; width: 140px;">الاسم</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: white;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #F97316; font-weight: bold;">الجهة</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: white;">${organization || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #F97316; font-weight: bold;">رقم التواصل</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: white;" dir="ltr">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #F97316; font-weight: bold;">البريد الإلكتروني</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: white;" dir="ltr">${email}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #F97316; font-weight: bold;">الخدمة المطلوبة</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: white;">${service}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #F97316; font-weight: bold;">الميزانية</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: white;">${budget || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #F97316; font-weight: bold;">تاريخ التسليم</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.1); color: white;">${deadline || '—'}</td>
            </tr>
          </table>
          ${brief ? `
          <div style="margin-top: 24px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
            <h3 style="color: #F97316; margin: 0 0 12px 0; font-size: 16px;">نبذة عن المشروع</h3>
            <p style="color: rgba(255,255,255,0.8); margin: 0; line-height: 1.7;">${brief}</p>
          </div>
          ` : ''}
        </div>
        <div style="padding: 16px 32px; background: rgba(255,255,255,0.03); text-align: center;">
          <p style="margin: 0; color: rgba(255,255,255,0.4); font-size: 13px;">تم الإرسال من موقع محيط</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"موقع محيط" <${process.env.SMTP_USER || 'info@muhitsolution.com'}>`,
      to: 'info@muhitsolution.com',
      replyTo: email,
      subject: `طلب مشروع جديد — ${name} | ${service}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
