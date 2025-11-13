import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json();

    // Validate required fields
    if (!to || !subject || !message) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: to, subject, message'
      }, { status: 400 });
    }

    // Create transporter with SMTP settings
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Add connection timeout and other options for better reliability
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 60000,
    });

    // Verify transporter configuration
    await transporter.verify();

    // Generate unique message ID
    const messageId = `<${Date.now()}.${Math.random().toString(36).substring(2)}@combinezenith.com>`;
    console.log('Generated Message ID:', messageId);
    // Create HTML version of the message
    const htmlMessage = message
      .replace(/\n/g, '<br>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');

    // Send email with improved headers to avoid spam filters
    const mailOptions = {
      from: `"Combine Zenith" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: message,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="margin: 20px 0;">
              ${htmlMessage}
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <div style="text-align: center; color: #666; font-size: 12px;">
              <p>This email was sent from Combine Zenith's contact inquiry system.</p>
              <p>If you have any questions, please contact us at <a href="mailto:info@combinezenith.com" style="color: #667eea;">info@combinezenith.com</a></p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 11px;">
            <p>© ${messageId.split('.')[0]} Combine Zenith. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
      headers: {
        'X-Mailer': 'Combine Zenith Contact System',
        'X-Priority': '3', // Normal priority
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal',
        'List-Unsubscribe': `<mailto:${process.env.SMTP_USER}?subject=Unsubscribe>`,
        'Precedence': 'bulk',
        'Return-Path': process.env.SMTP_USER || '',
      },
      // Add DKIM if available (you'll need to configure this in your DNS)
      dkim: process.env.DKIM_PRIVATE_KEY ? {
        domainName: 'combinezenith.com',
        keySelector: 'default',
        privateKey: process.env.DKIM_PRIVATE_KEY,
      } : undefined,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    });
  } catch (error: unknown) {
    console.error('Error sending email:', error);

    // More specific error messages
    let errorMessage = 'Failed to send email';
    let errorDetails: string | undefined;

    if (error instanceof Error) {
      errorDetails = error.message;

      // Check for specific error codes if available
      const errorWithCode = error as Error & { code?: string };
      if (errorWithCode.code === 'EAUTH') {
        errorMessage = 'Authentication failed. Please check SMTP credentials.';
      } else if (errorWithCode.code === 'ECONNREFUSED') {
        errorMessage = 'Could not connect to mail server. Please check SMTP settings.';
      } else if (errorWithCode.code === 'ETIMEDOUT') {
        errorMessage = 'Connection timed out. Please try again.';
      }
    }

    return NextResponse.json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? errorDetails : undefined
    }, { status: 500 });
  }
}
