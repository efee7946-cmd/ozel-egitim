// Gmail SMTP üzerinden e-posta gönderimi.
// GMAIL_USER + GMAIL_APP_PASSWORD env değişkenleri gereklidir
// (Google hesabında 2FA açık olmalı, uygulama şifresi kullanılır).

import nodemailer from 'nodemailer';

let _transporter = null;

function getTransporter() {
    if (!_transporter) {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            throw new Error('GMAIL_USER / GMAIL_APP_PASSWORD tanımlı değil');
        }
        _transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
    }
    return _transporter;
}

export async function sendMail(to, subject, html) {
    await getTransporter().sendMail({
        from: `"YıldızCan" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
    });
}

function codeEmailHtml(introTr, introEn, code) {
    return `
    <div style="font-family:Arial,sans-serif;max-width:440px;margin:0 auto;padding:24px;border:1px solid #e5e9f2;border-radius:14px">
        <h2 style="color:#1d2746;margin:0 0 6px">YıldızCan</h2>
        <p style="color:#4a5578;font-size:14px;margin:0 0 18px">${introTr} / ${introEn}:</p>
        <div style="background:#f0f4ff;border:2px dashed #667eea;border-radius:12px;padding:16px;text-align:center;font-size:30px;font-weight:800;letter-spacing:8px;color:#3a4a8c">${code}</div>
        <p style="color:#8a93a8;font-size:12px;margin:18px 0 0">Bu kod 15 dakika geçerlidir. Bu isteği siz yapmadıysanız bu e-postayı yok sayabilirsiniz.<br>
        This code is valid for 15 minutes. If you didn't request this, you can ignore this email.</p>
    </div>`;
}

export function resetCodeEmailHtml(code) {
    return codeEmailHtml('Şifre sıfırlama kodunuz', 'Your password reset code', code);
}

export function verifyCodeEmailHtml(code) {
    return codeEmailHtml('E-posta doğrulama kodunuz', 'Your email verification code', code);
}
