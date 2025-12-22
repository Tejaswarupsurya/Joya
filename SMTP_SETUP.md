# SMTP Email Setup Guide (Port 587/TLS)

## 🎯 Overview

This guide explains how to configure SMTP email for Joya's signup verification using **port 587 with TLS** (STARTTLS).

---

## 📧 **Gmail SMTP Setup** (Recommended for Testing)

### **Step 1: Enable 2-Factor Authentication**

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled

### **Step 2: Generate App Password**

1. Visit [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Other (Custom name)**
3. Name it: `Joya App`
4. Click **Generate**
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### **Step 3: Update .env File**

```env
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop  # App password (remove spaces)
JWT_SECRET=your-random-jwt-secret-32chars
```

---

## 📮 **Other SMTP Providers**

### **Outlook/Hotmail**

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### **Yahoo Mail**

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password  # Generate at account.yahoo.com/account/security
```

### **Custom SMTP Server**

```env
SMTP_HOST=smtp.yourdomain.com
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
```

---

## 🔐 **JWT Secret Generation**

Generate a secure random secret:

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or manually create a strong 32+ character string
```

Example:

```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

## 🧪 **Testing the Setup**

### **1. Start Your App**

```bash
npm start
```

Look for this message in console:

```
✅ SMTP server ready to send emails (Port 587/TLS)
```

### **2. Test Signup Flow**

1. Go to `http://localhost:3000/signup`
2. Fill in:
   - **Username:** testuser
   - **Email:** your-test-email@gmail.com
   - **Password:** Test@123
   - **Confirm Password:** Test@123
3. Click **Sign Up**
4. Check your email for 6-digit OTP
5. Enter OTP on verification page
6. You should receive welcome email after verification

---

## ⚠️ **Common Issues & Solutions**

### **❌ "Invalid login: 535-5.7.8 Username and Password not accepted"**

**Solution:** You're using your Gmail password instead of App Password

- Generate App Password (see Step 2 above)
- Use 16-character app password (without spaces)

### **❌ "SMTP connection failed"**

**Solution:** Check SMTP settings

```env
SMTP_HOST=smtp.gmail.com  # Correct for Gmail
SMTP_USER=your-email@gmail.com  # Must be full email
SMTP_PASS=your-app-password  # 16 chars, no spaces
```

### **❌ "Self signed certificate in certificate chain"**

**Solution:** Already handled in code (TLS v1.2+ with proper cert validation)

### **❌ Email goes to spam**

**Temporary Solution:** Check spam folder, mark as "Not Spam"

**Long-term Solution:** For production:

- Use a custom domain (e.g., noreply@joya.com)
- Set up SPF, DKIM, and DMARC records
- Use transactional email services (SendGrid, AWS SES, Mailgun)

---

## 🚀 **Production Recommendations**

### **For Production, Use Professional Email Service:**

#### **Option 1: AWS SES** (Cheap, Reliable)

- Free tier: 62,000 emails/month
- $.10 per 1,000 emails after
- High deliverability

#### **Option 2: SendGrid** (Popular)

- Free tier: 100 emails/day
- Easy API integration
- Better analytics

#### **Option 3: Mailgun** (Developer-Friendly)

- Free tier: 5,000 emails/month
- Pay-as-you-go pricing

### **Update for Production:**

```env
# Production SMTP (Example: AWS SES)
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_USER=your-ses-username
SMTP_PASS=your-ses-password
```

---

## 📋 **Email Flow Summary**

### **Signup with Email Verification:**

1. User fills signup form
2. System generates 6-digit OTP
3. OTP stored in JWT token (expires in 10 minutes)
4. Email sent via SMTP port 587/TLS
5. User enters OTP on verification page
6. System verifies JWT token + OTP match
7. User account created & auto-logged in
8. Welcome email sent (non-blocking)

### **Security Features:**

- ✅ JWT tokens expire after 10 minutes
- ✅ 60-second cooldown between OTP resends
- ✅ TLS encryption (port 587)
- ✅ Passwords hashed with bcrypt (passport-local-mongoose)
- ✅ Session-based pending user data (not in database)

---

## 🧾 **Environment Variables Checklist**

```env
# Required for Email Verification
✅ SMTP_HOST=smtp.gmail.com
✅ SMTP_USER=your-email@gmail.com
✅ SMTP_PASS=your-app-password
✅ JWT_SECRET=your-random-secret

# Required for Application
✅ BASE_URL=http://localhost:3000  # Change to production URL
✅ SECRET=your-session-secret
✅ ATLASDB_URL=mongodb+srv://...
```

---

## 📞 **Support**

If emails aren't sending:

1. Check console logs for error messages
2. Verify SMTP credentials
3. Test with a different email provider
4. Check firewall/antivirus blocking port 587

---

**Last Updated:** December 22, 2025
