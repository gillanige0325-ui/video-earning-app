# 📡 API Documentation

Complete API reference for the Video Earning App.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-app.vercel.app/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "fullName": "John Doe",
  "phone": "+92 300 1234567" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "balance": 0,
    "total_earned": 0,
    "videos_watched_today": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400` - Missing required fields
- `400` - Email already registered
- `400` - Password too short (min 8 characters)

---

### Login User

Authenticate existing user.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "balance": 15.50,
    "total_earned": 25.00,
    "videos_watched_today": 10
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400` - Missing email or password
- `401` - Invalid credentials

---

## 👤 User Endpoints

### Get User Profile

Get current user's profile information.

**Endpoint:** `GET /api/user/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+92 300 1234567",
    "balance": 15.50,
    "total_earned": 25.00,
    "videos_watched_today": 10,
    "last_video_date": "2025-11-29",
    "created_at": "2025-11-01T10:00:00Z",
    "updated_at": "2025-11-29T15:30:00Z"
  }
}
```

**Errors:**
- `401` - Unauthorized (invalid/missing token)
- `404` - User not found

---

## 🎥 Video Endpoints

### Get Available Videos

Get list of videos available for watching.

**Endpoint:** `GET /api/videos/available`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `category` (optional) - Filter by category (action, comedy, drama, etc.)
- `limit` (optional) - Number of videos to return (default: 20)

**Example:**
```
GET /api/videos/available?category=action&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "videos": [
    {
      "id": "uuid",
      "title": "Epic Action Scene",
      "description": "Amazing fight sequence",
      "video_url": "https://video-url.mp4",
      "thumbnail_url": "https://thumbnail.jpg",
      "duration": 300,
      "category": "action",
      "earning_amount": 0.50,
      "created_at": "2025-11-29T10:00:00Z"
    }
  ],
  "watchStatus": {
    "canWatch": true,
    "videosWatchedToday": 10,
    "remainingVideos": 20
  }
}
```

**Errors:**
- `401` - Unauthorized

---

### Record Video Watch

Record that a user watched a video.

**Endpoint:** `POST /api/videos/watch`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "videoId": "uuid",
  "watchDuration": 240,  // seconds watched
  "completed": true      // true if watched 80%+
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Video completed! You earned $0.50",
  "earning": 0.50
}
```

**Errors:**
- `400` - Missing required fields
- `400` - Daily video limit reached
- `400` - Video already watched today
- `401` - Unauthorized

---

## 💰 Withdrawal Endpoints

### Request Withdrawal

Create a new withdrawal request.

**Endpoint:** `POST /api/withdrawal/request`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 10.00,
  "paymentMethod": "bank_transfer",
  "paymentDetails": {
    "accountName": "John Doe",
    "accountNumber": "1234567890",
    "bankName": "HBL",
    "branchCode": "0123"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Withdrawal request submitted. You will receive PKR 2785.00",
  "withdrawal": {
    "id": "uuid",
    "user_id": "uuid",
    "amount_usd": 10.00,
    "amount_pkr": 2785.00,
    "exchange_rate": 278.50,
    "status": "pending",
    "payment_method": "bank_transfer",
    "created_at": "2025-11-29T15:30:00Z"
  }
}
```

**Errors:**
- `400` - Missing required fields
- `400` - Amount below minimum ($5)
- `400` - Insufficient balance
- `401` - Unauthorized

---

### Get Withdrawal History

Get user's withdrawal history and statistics.

**Endpoint:** `GET /api/withdrawal/history`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "history": [
    {
      "id": "uuid",
      "amount_usd": 10.00,
      "amount_pkr": 2785.00,
      "exchange_rate": 278.50,
      "status": "completed",
      "payment_method": "bank_transfer",
      "created_at": "2025-11-29T15:30:00Z",
      "processed_at": "2025-11-30T10:00:00Z"
    }
  ],
  "stats": {
    "totalWithdrawn": 50.00,
    "pendingAmount": 10.00,
    "completedWithdrawals": 5,
    "pendingWithdrawals": 1
  }
}
```

**Errors:**
- `401` - Unauthorized

---

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🔒 Security

### Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authentication: 5 requests per minute
- Video watching: 30 requests per day
- Withdrawals: 10 requests per hour

### Token Expiration

JWT tokens expire after 7 days. Users must re-authenticate.

### Password Requirements

- Minimum 8 characters
- Hashed with bcrypt (10 rounds)

---

## 💡 Usage Examples

### JavaScript/TypeScript

```typescript
// Register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    fullName: 'John Doe'
  })
});
const data = await response.json();
localStorage.setItem('token', data.token);

// Get videos
const videosResponse = await fetch('/api/videos/available', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
const videos = await videosResponse.json();

// Watch video
await fetch('/api/videos/watch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    videoId: 'video-uuid',
    watchDuration: 240,
    completed: true
  })
});
```

### cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get videos (with token)
curl http://localhost:3000/api/videos/available \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Watch video
curl -X POST http://localhost:3000/api/videos/watch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "videoId": "video-uuid",
    "watchDuration": 240,
    "completed": true
  }'
```

---

## 🧪 Testing

### Postman Collection

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "Video Earning App API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/api/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"fullName\": \"Test User\"\n}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ]
}
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Amounts are in USD unless specified
- PKR conversion uses rate from environment variable
- Video duration is in seconds
- Daily limits reset at midnight UTC

---

## 🆘 Support

For API issues or questions:
- Email: bilalsha03255@gmail.com
- GitHub Issues: [Create Issue](https://github.com/gillanige0325-ui/video-earning-app/issues)