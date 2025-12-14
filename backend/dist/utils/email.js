"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderConfirmationTemplate = exports.getProfileUpdateConfirmationTemplate = exports.getOrderNotificationTemplate = exports.getContactFormEmailTemplate = exports.getOTPEmailTemplate = exports.getPasswordResetOTPTemplate = exports.generateOTP = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create transporter
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
// Verify connection
transporter.verify((error) => {
    if (error) {
        console.log('SMTP connection error:', error.message);
    }
    else {
        console.log('SMTP server is ready to send emails');
    }
});
const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `"${process.env.SMTP_FROM_NAME || 'EZ Masala'}" <${process.env.SMTP_FROM_EMAIL}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${options.to}`);
        return true;
    }
    catch (error) {
        console.error('Email sending failed:', error.message);
        return false;
    }
};
exports.sendEmail = sendEmail;
// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
// Password Reset OTP Email Template
const getPasswordResetOTPTemplate = (otp, name) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - EZ Masala</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #dc2626; border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">EZ Masala</h1>
            </td>
          </tr>

          <!-- Lock Icon -->
          <tr>
            <td style="padding: 30px 40px 0; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: #fee2e2; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">🔐</span>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px 40px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; text-align: center;">Reset Your Password</h2>
              <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                Hello ${name},
              </p>
              <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                We received a request to reset your password. Use the OTP below to proceed with resetting your password:
              </p>

              <!-- OTP Box -->
              <div style="background-color: #fef2f2; border: 2px dashed #dc2626; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
                <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">Your Password Reset OTP</p>
                <p style="margin: 0; color: #dc2626; font-size: 36px; font-weight: bold; letter-spacing: 8px;">${otp}</p>
              </div>

              <p style="margin: 0 0 20px; color: #666666; font-size: 14px; line-height: 1.5;">
                This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
              </p>

              <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                If you didn't request a password reset, please ignore this email or contact support if you have concerns.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8f8f8; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} EZ Masala. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
exports.getPasswordResetOTPTemplate = getPasswordResetOTPTemplate;
// OTP Email Template
const getOTPEmailTemplate = (otp, name) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - EZ Masala</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #000000; border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">EZ Masala</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px;">Verify Your Email</h2>
              <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                Hello ${name},
              </p>
              <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                Thank you for signing up with EZ Masala! Please use the following OTP to verify your email address:
              </p>

              <!-- OTP Box -->
              <div style="background-color: #f8f8f8; border: 2px dashed #000000; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
                <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">Your One-Time Password</p>
                <p style="margin: 0; color: #000000; font-size: 36px; font-weight: bold; letter-spacing: 8px;">${otp}</p>
              </div>

              <p style="margin: 0 0 20px; color: #666666; font-size: 14px; line-height: 1.5;">
                This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
              </p>

              <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                If you didn't request this verification, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8f8f8; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} EZ Masala. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
exports.getOTPEmailTemplate = getOTPEmailTemplate;
// Contact Form Email Template (sent to website admin)
const getContactFormEmailTemplate = (contact) => {
    const queryTypeLabel = contact.queryType === 'bulk' ? 'Bulk/HoReCa Enquiry' :
        contact.queryType === 'order' ? 'Order/Delivery' :
            contact.queryType === 'howto' ? 'How to Use' :
                contact.queryType || 'General';
    const isBulkEnquiry = contact.queryType === 'bulk';
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isBulkEnquiry ? 'New Bulk Enquiry' : 'New Contact Form Submission'} - EZ Masala</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: ${isBulkEnquiry ? '#f59e0b' : '#000000'}; border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">EZ Masala</h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 14px;">${isBulkEnquiry ? 'New Bulk Enquiry Received!' : 'New Contact Form Submission'}</p>
            </td>
          </tr>

          <!-- Alert Icon -->
          <tr>
            <td style="padding: 30px 40px 0; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: ${isBulkEnquiry ? '#fef3c7' : '#e5e5e5'}; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">${isBulkEnquiry ? '📦' : '📧'}</span>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px 40px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 20px; text-align: center;">
                ${isBulkEnquiry ? 'Bulk/HoReCa Enquiry Details' : 'Contact Form Details'}
              </h2>

              <!-- Contact Details Box -->
              <div style="background-color: #f8f8f8; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 120px;">Name:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #000; font-weight: 600;">${contact.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Email:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #000;">
                      <a href="mailto:${contact.email}" style="color: #2563eb; text-decoration: none;">${contact.email}</a>
                    </td>
                  </tr>
                  ${contact.mobile ? `
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Mobile:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #000;">
                      <a href="tel:${contact.mobile}" style="color: #2563eb; text-decoration: none;">${contact.mobile}</a>
                    </td>
                  </tr>
                  ` : ''}
                  ${contact.city ? `
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">City/State:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #000;">${contact.city}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Query Type:</td>
                    <td style="padding: 10px 0;">
                      <span style="background-color: ${isBulkEnquiry ? '#fef3c7' : '#e5e5e5'}; color: ${isBulkEnquiry ? '#92400e' : '#333'}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${queryTypeLabel}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Message Box -->
              <div style="background-color: #f8f8f8; border-left: 4px solid ${isBulkEnquiry ? '#f59e0b' : '#000'}; border-radius: 0 12px 12px 0; padding: 20px;">
                <h3 style="margin: 0 0 10px; color: #333; font-size: 14px; text-transform: uppercase;">Message</h3>
                <p style="margin: 0; color: #666; line-height: 1.6; white-space: pre-wrap;">${contact.message}</p>
              </div>

              <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.5; text-align: center;">
                Submitted on ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8f8f8; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                <a href="${process.env.ADMIN_URL || 'https://admin.ezmasalaa.com'}/contacts" style="color: #000; text-decoration: none; font-weight: 600;">View in Admin Dashboard →</a>
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} EZ Masala. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
exports.getContactFormEmailTemplate = getContactFormEmailTemplate;
// Order Notification Email Template (sent to website admin when new order is placed)
const getOrderNotificationTemplate = (order, customerName) => {
    const itemsList = order.items.map((item) => `${item.title} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`).join('\n');
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Received - EZ Masala</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #22c55e; border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">EZ Masala</h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 14px;">🎉 New Order Received!</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px 40px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 20px; text-align: center;">
                Order #${order.orderId}
              </h2>

              <!-- Order Summary Box -->
              <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Customer:</td>
                    <td style="padding: 8px 0; color: #000; font-weight: 600;">${customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Phone:</td>
                    <td style="padding: 8px 0; color: #000;">
                      <a href="tel:${order.address?.phone}" style="color: #2563eb; text-decoration: none;">${order.address?.phone || 'N/A'}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Payment:</td>
                    <td style="padding: 8px 0;">
                      <span style="background-color: ${order.paymentMethod === 'cod' ? '#fef3c7' : '#dcfce7'}; color: ${order.paymentMethod === 'cod' ? '#92400e' : '#166534'}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                        ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Total Amount:</td>
                    <td style="padding: 8px 0; color: #22c55e; font-weight: bold; font-size: 20px;">₹${order.total?.toFixed(2)}</td>
                  </tr>
                </table>
              </div>

              <!-- Items Box -->
              <div style="background-color: #f8f8f8; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px; color: #333; font-size: 14px; text-transform: uppercase;">Order Items</h3>
                ${order.items.map((item) => `
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="color: #333;">${item.title} × ${item.quantity}</span>
                    <span style="color: #000; font-weight: 600;">₹${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                `).join('')}
                <div style="display: flex; justify-content: space-between; padding-top: 15px; margin-top: 10px; border-top: 2px solid #ddd;">
                  <span style="color: #333; font-weight: bold;">Total</span>
                  <span style="color: #22c55e; font-weight: bold; font-size: 18px;">₹${order.total?.toFixed(2)}</span>
                </div>
              </div>

              <!-- Delivery Address -->
              <div style="background-color: #f8f8f8; border-radius: 12px; padding: 20px;">
                <h3 style="margin: 0 0 10px; color: #333; font-size: 14px; text-transform: uppercase;">Delivery Address</h3>
                <p style="margin: 0; color: #666; line-height: 1.6;">
                  ${order.address?.name || customerName}<br>
                  ${order.address?.street || ''}<br>
                  ${order.address?.city || ''}, ${order.address?.state || ''} ${order.address?.zipCode || ''}<br>
                  Phone: ${order.address?.phone || 'N/A'}
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8f8f8; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                <a href="${process.env.ADMIN_URL || 'https://admin.ezmasalaa.com'}/orders" style="color: #000; text-decoration: none; font-weight: 600;">View in Admin Dashboard →</a>
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} EZ Masala. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
exports.getOrderNotificationTemplate = getOrderNotificationTemplate;
// Profile Update Confirmation Email Template
const getProfileUpdateConfirmationTemplate = (userName, changes) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Profile Updated - EZ Masala</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #3b82f6; border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">EZ Masala</h1>
            </td>
          </tr>

          <!-- Icon -->
          <tr>
            <td style="padding: 30px 40px 0; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: #dbeafe; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">✓</span>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px 40px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; text-align: center;">Profile Updated Successfully</h2>
              <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                Hello ${userName},
              </p>
              <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                Your profile has been successfully updated. Here are the changes that were made:
              </p>

              <!-- Changes Box -->
              <div style="background-color: #f0f9ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px; color: #333; font-size: 16px;">Updated Information:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #666;">
                  ${changes.map(change => `<li style="margin-bottom: 8px;">${change}</li>`).join('')}
                </ul>
              </div>

              <p style="margin: 0 0 20px; color: #666666; font-size: 14px; line-height: 1.5;">
                If you didn't make these changes, please contact our support team immediately.
              </p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'https://ezmasalaa.com'}/profile" style="background-color: #3b82f6; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">View Profile</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8f8f8; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                Need help? Contact us at <a href="mailto:info@ezmasalaa.com" style="color: #3b82f6;">info@ezmasalaa.com</a>
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} EZ Masala. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
exports.getProfileUpdateConfirmationTemplate = getProfileUpdateConfirmationTemplate;
// Order Confirmation Email Template
const getOrderConfirmationTemplate = (order, customerName) => {
    const itemsHtml = order.items.map((item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center;">
          ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 12px;">` : ''}
          <span style="color: #333;">${item.title}</span>
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; color: #666;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; color: #333;">₹${item.price}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; color: #333; font-weight: 600;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - EZ Masala</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #000000; border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">EZ Masala</h1>
            </td>
          </tr>

          <!-- Success Icon -->
          <tr>
            <td style="padding: 30px 40px 0; text-align: center;">
              <div style="width: 80px; height: 80px; background-color: #22c55e; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">✓</span>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px 40px;">
              <h2 style="margin: 0 0 10px; color: #333333; font-size: 24px; text-align: center;">Order Confirmed!</h2>
              <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5; text-align: center;">
                Thank you for your order, ${customerName}!
              </p>

              <!-- Order Details Box -->
              <div style="background-color: #f8f8f8; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">Order ID:</span>
                  <span style="color: #000; font-weight: bold;">${order.orderId}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">Order Date:</span>
                  <span style="color: #000;">${new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Payment Method:</span>
                  <span style="color: #000;">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                </div>
              </div>

              <!-- Items Table -->
              <h3 style="margin: 0 0 15px; color: #333; font-size: 18px;">Order Items</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #f8f8f8;">
                    <th style="padding: 12px; text-align: left; color: #666; font-size: 14px;">Item</th>
                    <th style="padding: 12px; text-align: center; color: #666; font-size: 14px;">Qty</th>
                    <th style="padding: 12px; text-align: right; color: #666; font-size: 14px;">Price</th>
                    <th style="padding: 12px; text-align: right; color: #666; font-size: 14px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Totals -->
              <div style="border-top: 2px solid #eee; padding-top: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">Subtotal:</span>
                  <span style="color: #333;">₹${order.subtotal?.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">Tax:</span>
                  <span style="color: #333;">₹${order.tax?.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #eee;">
                  <span style="color: #000; font-weight: bold; font-size: 18px;">Total:</span>
                  <span style="color: #000; font-weight: bold; font-size: 18px;">₹${order.total?.toFixed(2)}</span>
                </div>
              </div>

              <!-- Delivery Address -->
              <div style="margin-top: 30px; background-color: #f8f8f8; border-radius: 12px; padding: 20px;">
                <h3 style="margin: 0 0 15px; color: #333; font-size: 16px;">Delivery Address</h3>
                <p style="margin: 0; color: #666; line-height: 1.6;">
                  ${order.address?.street || ''}<br>
                  ${order.address?.city || ''}, ${order.address?.state || ''} ${order.address?.zipCode || ''}<br>
                  Phone: ${order.address?.phone || 'N/A'}
                </p>
              </div>

              <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.5; text-align: center;">
                We'll send you another email when your order ships. If you have any questions, feel free to contact us.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f8f8f8; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                Need help? Contact us at <a href="mailto:info@ezmasalaa.com" style="color: #000;">info@ezmasalaa.com</a>
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} EZ Masala. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
exports.getOrderConfirmationTemplate = getOrderConfirmationTemplate;
//# sourceMappingURL=email.js.map