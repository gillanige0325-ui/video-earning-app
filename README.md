# 🎬 Video Earning App

A full-featured online earning platform where users can watch videos and earn real money. Built with Next.js 14, TypeScript, Supabase, and Stripe.

## ✨ Features

### 🔐 Secure Authentication
- Email/password registration and login
- JWT-based authentication
- Bcrypt password hashing
- Supabase Auth integration
- Protected routes and API endpoints

### 🎥 Video Watching System
- Watch full movie clips and videos
- Earn $0.5 per completed video
- 30 videos daily limit per user
- Video completion tracking (80% watch time required)
- Multiple video categories
- Prevents duplicate watches per day
- Real-time balance updates

### 💰 Withdrawal System
- Minimum withdrawal: $5 USD
- Automatic USD to PKR conversion
- Current exchange rate: PKR 278.5 per USD
- Multiple payment methods support
- Withdrawal history tracking
- Status tracking (pending, processing, completed, rejected)
- Real-time balance management

### 📊 Dashboard Features
- Real-time earnings display
- Videos watched today counter
- Remaining videos indicator
- Total earnings statistics
- Withdrawal history
- User profile management

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + JWT
- **Payments**: Stripe (for withdrawals)
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Stripe account (for withdrawals)

### 1. Clone the repository
```bash
git clone https://github.com/gillanige0325-ui/video-earning-app.git
cd video-earning-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `database/schema.sql`
3. Get your project URL and anon key from Settings > API

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# JWT
JWT_SECRET=your_random_jwt_secret_key_here

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
DAILY_VIDEO_LIMIT=30
VIDEO_EARNING_AMOUNT=0.5
MINIMUM_WITHDRAWAL=5
PKR_EXCHANGE_RATE=278.5
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables
4. Deploy!

```bash
vercel --prod
```

## 📱 Usage

### For Users

1. **Sign Up**: Create an account with email and password
2. **Login**: Access your dashboard
3. **Watch Videos**: Browse available videos and watch to earn
4. **Track Earnings**: Monitor your balance and daily progress
5. **Withdraw**: Request withdrawal when balance reaches $5

### For Admins

Add videos through Supabase dashboard or create an admin panel:

```sql
INSERT INTO videos (title, description, video_url, thumbnail_url, duration, category)
VALUES ('Video Title', 'Description', 'https://video-url.com', 'https://thumbnail.jpg', 300, 'action');
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Row Level Security (RLS) in Supabase
- Protected API routes
- Input validation
- SQL injection prevention
- XSS protection

## 📊 Database Schema

### Users Table
- User profiles and authentication
- Balance and earnings tracking
- Daily video watch limits

### Videos Table
- Video content management
- Categories and metadata
- Earning amounts per video

### Video Watches Table
- Watch history tracking
- Completion status
- Earnings per watch

### Withdrawals Table
- Withdrawal requests
- USD to PKR conversion
- Status tracking

## 🎯 Key Features Implementation

### Daily Limit System
- Resets at midnight
- Tracks videos watched per day
- Prevents over-earning

### Earning Calculation
- $0.5 per completed video
- Requires 80% watch time
- Instant balance update

### Withdrawal Process
1. User requests withdrawal (min $5)
2. System converts USD to PKR
3. Deducts from user balance
4. Creates withdrawal record
5. Admin processes payment

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Created by Bilal Sha

## 🐛 Known Issues

- Video URLs need to be updated with real content
- Admin panel not yet implemented
- Payment gateway integration pending

## 🔮 Future Enhancements

- [ ] Admin dashboard
- [ ] Video upload system
- [ ] Referral program
- [ ] Mobile app (React Native)
- [ ] Multiple payment methods
- [ ] Social media integration
- [ ] Video categories filtering
- [ ] User ratings and reviews
- [ ] Leaderboard system
- [ ] Push notifications

## 📞 Support

For support, email bilalsha03255@gmail.com

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Note**: This is a demonstration project. Update video URLs, implement proper payment processing, and add security measures before production use.