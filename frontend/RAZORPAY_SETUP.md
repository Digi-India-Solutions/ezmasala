# Razorpay Payment Integration Guide

## Overview
This guide explains how the Razorpay payment integration works in EZ Masala and how to set it up.

## Features
- ✅ Real Razorpay payment gateway integration
- ✅ Support for Card, UPI, Net Banking, and Wallets
- ✅ Payment signature verification for security
- ✅ Order storage in MongoDB with payment details
- ✅ Cash on Delivery (COD) option
- ✅ Payment success/failure handling
- ✅ Automatic cart clearing on successful payment

## Setup Instructions

### 1. Get Razorpay API Keys

1. Sign up at [https://razorpay.com](https://razorpay.com)
2. Go to Dashboard → Settings → API Keys
3. Generate new API keys (Key ID and Key Secret)
4. **Important**: Use Test Mode keys for development

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ez-masala
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/ez-masala

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Razorpay Configuration (Use Test Keys for development)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

### 3. Verify MongoDB Connection

Ensure MongoDB is running:
- **Local**: `mongod` service should be active
- **Atlas**: Connection string should be correct in `.env.local`

## How It Works

### Order Flow

1. **Cart** → User adds items to cart
2. **Address** → User selects/adds delivery address
3. **Summary** → User reviews order details
4. **Payment** → User selects payment method:
   - **Razorpay** (Online Payment)
   - **Cash on Delivery**

### Razorpay Payment Flow

```
User clicks "Pay Now"
    ↓
Create Razorpay Order (API: /api/razorpay/create-order)
    ↓
Open Razorpay Checkout Modal
    ↓
User completes payment
    ↓
Verify Payment Signature (API: /api/razorpay/verify-payment)
    ↓
Save Order to MongoDB (API: /api/orders)
    ↓
Redirect to Success Page
    ↓
Clear Cart
```

### Database Schema

Orders are saved with the following structure:

```javascript
{
  orderId: "ORD1234567890123",
  userId: ObjectId or null,
  items: [
    {
      productId: "123",
      title: "Turmeric Powder",
      price: 150,
      quantity: 2,
      image: "/products/turmeric.jpg"
    }
  ],
  address: {
    street: "123 Main St",
    city: "Delhi",
    state: "Delhi",
    zipCode: "110001",
    country: "India"
  },
  subtotal: 300,
  tax: 54,
  total: 354,
  paymentMethod: "razorpay",
  paymentStatus: "paid",
  razorpayOrderId: "order_xxxxx",
  razorpayPaymentId: "pay_xxxxx",
  razorpaySignature: "signature_xxxxx",
  status: "pending",
  createdAt: Date
}
```

## Payment Methods

### 1. Razorpay (Online Payment)
- **Status**: Default selected
- **Supports**: Cards, UPI, Net Banking, Wallets
- **Payment Status**: Marked as "paid" immediately
- **Order Status**: "pending" (awaiting fulfillment)

### 2. Cash on Delivery
- **Payment Status**: "pending"
- **Order Status**: "pending"
- **Payment**: Collected on delivery

## Testing Payments

### Test Card Details (Razorpay Test Mode)

**Success**:
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failure**:
- Card Number: `4111 1111 1111 1112`

### Test UPI
- UPI ID: `success@razorpay`

## API Endpoints

### 1. Create Razorpay Order
- **URL**: `/api/razorpay/create-order`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "amount": 354,
    "currency": "INR",
    "receipt": "order_1234567890",
    "notes": {
      "items": "Turmeric Powder x 2"
    }
  }
  ```

### 2. Verify Payment
- **URL**: `/api/razorpay/verify-payment`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "razorpay_order_id": "order_xxxxx",
    "razorpay_payment_id": "pay_xxxxx",
    "razorpay_signature": "signature_xxxxx"
  }
  ```

### 3. Create Order
- **URL**: `/api/orders`
- **Method**: `POST`
- **Body**: Order data with payment details

### 4. Get Orders
- **URL**: `/api/orders`
- **Method**: `GET`
- **Query**: `?userId=xxxxx` (optional)

## Files Modified/Created

### New Files
- `src/lib/razorpay.ts` - Razorpay SDK configuration
- `src/types/razorpay.ts` - TypeScript interfaces
- `src/app/api/razorpay/create-order/route.ts` - Order creation API
- `src/app/api/razorpay/verify-payment/route.ts` - Payment verification API
- `src/components/CheckoutButton.tsx` - Reusable checkout component
- `src/app/payment/success/page.tsx` - Success page
- `src/app/payment/failure/page.tsx` - Failure page

### Modified Files
- `src/lib/models/Order.ts` - Added Razorpay fields
- `src/app/api/orders/route.ts` - Added Razorpay payment handling
- `src/app/checkout/payment/page.tsx` - Integrated real payment flow

## Security

1. **Payment Signature Verification**: All payments are verified using HMAC SHA256
2. **Server-Side Validation**: Payment verification happens on the server
3. **Environment Variables**: Sensitive keys are stored in `.env.local`
4. **HTTPS Required**: Production must use HTTPS

## Debugging

Check the browser console and server logs for:
- `Creating order with data:` - Order creation started
- `Order created successfully:` - Order saved to MongoDB
- `Payment error:` - Payment processing errors

## Going Live

1. Switch to Live Mode in Razorpay Dashboard
2. Generate Live API Keys
3. Update `.env.local` with Live Keys:
   ```env
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   ```
4. Complete KYC verification on Razorpay
5. Configure webhooks for payment status updates

## Support

- Razorpay Docs: [https://razorpay.com/docs](https://razorpay.com/docs)
- Integration Docs: [https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)
