import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',  // Gmail SMTP 서버
      port: 587,               // 포트
      secure: false,           // true일 경우 SSL 사용 (465), false일 경우 TLS 사용 (587)
      auth: {
        //user: process.env.EMAIL_USER, // Gmail 주소 (관리자)
        //pass: process.env.EMAIL_PASS, // Gmail 앱 비밀번호 (보통 16자리) 
        user: "kejgogo78@gmail.com", // Gmail 주소 (관리자)
        pass: "11111111111111111111", // Gmail 앱 비밀번호 (보통 16자리) 
        
      },
    });

    await transporter.sendMail({
      from: `관리자" <kejgogo78@gmail.com>`,
      to: `"${name}" <${email}>`, // 수신자 이메일
      subject: '[서비스] 임시 비밀번호가 발급되었습니다. (** 로그인 후 꼭 변경해주세요)',
      html: message,    // HTML 본문 사용
    });
    /*
    await transporter.sendMail({
      from: `KEES 관리자" <${process.env.EMAIL_USER}>`,
      to: `"${name}" <${email}>`, // 수신자 이메일
      subject: '[KEES 서비스] 임시 비밀번호가 발급되었습니다. (** 로그인 후 꼭 변경해주세요)',
      // text: message, // 제거
      html: message,    // HTML 본문 사용
    });*/

    res.status(200).json({ message: '메일 전송 성공' });
  } catch (error) {
    console.error('메일 전송 실패:', error);
    res.status(500).json({ message: '메일 전송 실패' });
  }
}
