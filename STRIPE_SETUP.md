# 💳 Stripe Payment Integration - Setup Guide

## 🎯 Overview

This guide helps you set up **Stripe Checkout** in **TEST MODE** for the Joya booking platform. No real money will be charged.

---

## 📋 Prerequisites

- Stripe account (free): https://dashboard.stripe.com/register
- Node.js and npm installed
- Joya application running locally

---

## 🔧 Setup Steps

### **Step 1: Get Stripe Test API Keys**

1. Sign up/login to Stripe: https://dashboard.stripe.com
2. Make sure you're in **TEST MODE** (toggle in top right)
3. Go to: **Developers → API Keys**
4. Copy your **Secret key** (starts with `sk_test_...`)

### **Step 2: Configure Environment Variables**

Update your `.env` file:

```env
# Stripe Payment Configuration (TEST MODE)
STRIPE_SECRET_KEY=sk_test_51Qxxxxxxxxxx  # Your test secret key
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxx   # Leave this for now
BASE_URL=http://localhost:3000           # Your local URL
```

### **Step 3: Install Stripe CLI (for Webhooks)**

#### Windows (PowerShell):

```powershell
# Download Stripe CLI
Invoke-WebRequest -Uri https://github.com/stripe/stripe-cli/releases/latest/download/stripe_windows_x86_64.zip -OutFile stripe.zip

# Extract
Expand-Archive stripe.zip -DestinationPath .

# Move to a permanent location
Move-Item stripe.exe C:\stripe\stripe.exe

# Add to PATH (optional)
$env:PATH += ";C:\stripe"
```

#### Mac/Linux:

```bash
brew install stripe/stripe-cli/stripe
# OR
curl -L https://github.com/stripe/stripe-cli/releases/latest/download/stripe_linux_x86_64.tar.gz | tar -xz
```

### **Step 4: Test Webhook Locally**

1. **Login to Stripe CLI:**

```bash
stripe login
```

Follow the browser prompt to authenticate.

2. **Forward webhooks to your local server:**

```bash
stripe listen --forward-to localhost:3000/payments/webhook
```

3. **Copy the webhook secret** (starts with `whsec_...`)
4. **Update `.env`:**

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxx  # Paste the secret here
```

5. **Keep the terminal running!** Webhooks will only work while `stripe listen` is active.

---

## 🧪 Testing the Payment Flow

### **Step 1: Start Your Application**

```bash
npm start
```

### **Step 2: Create a Test Booking**

1. Browse to a listing: `http://localhost:3000/listings`
2. Click "Book Now"
3. Select dates and guests
4. Click **"Proceed to Payment"**
5. You'll be redirected to **Stripe Checkout**

### **Step 3: Use Test Card**

On the Stripe Checkout page, use:

- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **Name:** Any name
- **Email:** Any email

### **Step 4: Complete Payment**

1. Click "Pay"
2. You'll be redirected to **Success Page**
3. Check terminal running `stripe listen` - you'll see:
   ```
   --> checkout.session.completed
   ```
4. Check your application logs:
   ```
   ✅ Payment confirmed! Booking <id> status: CONFIRMED
   ```

---

## 🔍 Verification

### **1. Check Database**

```javascript
// In MongoDB, your booking should have:
{
  status: "confirmed",
  paymentStatus: "completed",
  stripeSessionId: "cs_test_...",
  stripePaymentIntentId: "pi_..."
}
```

### **2. Check Stripe Dashboard**

- Go to: **Payments** tab
- You'll see the test payment
- Click to view details

---

## 🚨 Troubleshooting

### **Problem: Webhook not firing**

- **Solution:** Make sure `stripe listen` is running
- Check if webhook secret is correct in `.env`
- Restart your app after changing `.env`

### **Problem: "Invalid API key"**

- **Solution:** Verify you copied the **test** key (starts with `sk_test_`)
- Make sure no extra spaces in `.env`

### **Problem: Booking stays "pending_payment"**

- **Solution:** Webhook didn't fire. Check:
  1. `stripe listen` terminal is running
  2. Webhook secret in `.env` is correct
  3. Check application logs for webhook errors

### **Problem: "No such checkout session"**

- **Solution:** Using wrong Stripe account or wrong API key

---

## 🧪 Test Cards Reference

### **Successful Payments:**

| Card Number           | Description           |
| --------------------- | --------------------- |
| `4242 4242 4242 4242` | Visa - succeeds       |
| `5555 5555 5555 4444` | Mastercard - succeeds |

### **Failed Payments (for testing errors):**

| Card Number           | Description        |
| --------------------- | ------------------ |
| `4000 0000 0000 0002` | Card declined      |
| `4000 0000 0000 9995` | Insufficient funds |

Full list: https://stripe.com/docs/testing#cards

---

## 📊 Payment Flow Diagram

```
User fills booking form
       ↓
Click "Proceed to Payment"
       ↓
Backend creates booking (status: pending_payment)
       ↓
Backend creates Stripe Checkout Session
       ↓
User redirected to Stripe Checkout page
       ↓
User enters test card (4242...)
       ↓
Stripe processes payment
       ↓
Stripe sends webhook → /payments/webhook
       ↓
Backend verifies webhook signature
       ↓
Backend updates booking (status: confirmed)
       ↓
User redirected to Success Page
```

---

## 🔐 Security Notes

1. **Never commit real API keys** to Git
2. **Webhook signature verification** is mandatory
3. **Never trust frontend** for payment confirmation
4. **Booking confirmation** only happens via webhook
5. **Test mode only** - no real money

---

## 🌐 Production Deployment

When deploying to production (EC2):

1. **Update `.env` on EC2:**

```env
BASE_URL=https://your-domain.com
```

2. **Create webhook endpoint in Stripe Dashboard:**

   - Go to: **Developers → Webhooks**
   - Click "Add endpoint"
   - URL: `https://your-domain.com/payments/webhook`
   - Events: `checkout.session.completed`
   - Copy the **signing secret**

3. **Update EC2 `.env`:**

```env
STRIPE_WEBHOOK_SECRET=whsec_production_secret
```

4. **Restart application on EC2**

---

## 📝 Important Files

- **Controller:** `controllers/payment.js`
- **Routes:** `routes/payment.js`
- **Model:** `models/booking.js`
- **Views:**
  - `views/bookings/new.ejs`
  - `views/payments/success.ejs`
  - `views/payments/cancel.ejs`

---

## ✅ Checklist

- [ ] Stripe account created
- [ ] Test API key added to `.env`
- [ ] Stripe CLI installed
- [ ] `stripe listen` running
- [ ] Webhook secret added to `.env`
- [ ] Application restarted
- [ ] Test booking created successfully
- [ ] Payment completed with test card
- [ ] Webhook received (check terminal)
- [ ] Booking status changed to "confirmed"
- [ ] Success page displayed

---

## 🆘 Need Help?

- Stripe Docs: https://stripe.com/docs
- Stripe Testing: https://stripe.com/docs/testing
- Webhook Guide: https://stripe.com/docs/webhooks
- Test Cards: https://stripe.com/docs/testing#cards

---

**Happy Testing! 🎉**
