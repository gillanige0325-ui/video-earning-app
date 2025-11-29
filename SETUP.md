# ⚡ Quick Setup Guide

Get your Video Earning App running in 10 minutes!

## 🎯 Quick Start

### 1. Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/gillanige0325-ui/video-earning-app.git
cd video-earning-app

# Install dependencies
npm install
```

### 2. Set Up Supabase (3 minutes)

1. **Create Project**: Go to [supabase.com](https://supabase.com) → New Project
2. **Run Schema**: Copy `database/schema.sql` → Supabase SQL Editor → Run
3. **Get Keys**: Settings → API → Copy URL and keys

### 3. Configure Environment (2 minutes)

Create `.env.local`:

```env
# Supabase (from step 2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (get from stripe.com/developers)
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# JWT Secret (generate random string)
JWT_SECRET=your_super_secret_random_string_here_32chars

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
DAILY_VIDEO_LIMIT=30
VIDEO_EARNING_AMOUNT=0.5
MINIMUM_WITHDRAWAL=5
PKR_EXCHANGE_RATE=278.5
```

### 4. Run Development Server (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### 5. Test the App (2 minutes)

1. Click "Sign Up" → Create account
2. Login with your credentials
3. Browse videos on dashboard
4. Watch a video to earn $0.5
5. Check your balance

## 🔑 Getting API Keys

### Supabase Keys

1. Go to your project at [supabase.com](https://supabase.com)
2. Click **Settings** (gear icon)
3. Click **API** in sidebar
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### Stripe Keys

1. Go to [stripe.com/developers](https://stripe.com/developers)
2. Make sure you're in **Test mode** (toggle in top right)
3. Click **API keys**
4. Copy:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### JWT Secret

Generate a random string:

```bash
# On Mac/Linux
openssl rand -base64 32

# Or use any random string generator
# Example: aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9
```

## 📁 Project Structure

```
video-earning-app/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── videos/       # Video management
│   │   ├── withdrawal/   # Withdrawal system
│   │   └── user/         # User profile
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── dashboard/        # Main dashboard (to be created)
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client
│   ├── auth.ts           # Authentication logic
│   ├── video.ts          # Video logic
│   └── withdrawal.ts     # Withdrawal logic
├── database/              # Database files
│   └── schema.sql        # Database schema
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.js    # Tailwind CSS config
└── next.config.js        # Next.js config
```

## 🎨 Customization

### Change Earning Amount

In `.env.local`:
```env
VIDEO_EARNING_AMOUNT=1.0  # Change to $1 per video
```

### Change Daily Limit

```env
DAILY_VIDEO_LIMIT=50  # Allow 50 videos per day
```

### Update Exchange Rate

```env
PKR_EXCHANGE_RATE=280.5  # Update to current rate
```

### Change Minimum Withdrawal

```env
MINIMUM_WITHDRAWAL=10  # Require $10 minimum
```

## 🎥 Adding Videos

### Via Supabase Dashboard

1. Go to Supabase → **Table Editor** → **videos**
2. Click **Insert row**
3. Fill in:
   - title: "Your Video Title"
   - description: "Video description"
   - video_url: "https://your-video-url.mp4"
   - thumbnail_url: "https://your-thumbnail.jpg"
   - duration: 300 (in seconds)
   - category: "action" (or any category)
   - earning_amount: 0.5
   - is_active: true

### Via SQL

```sql
INSERT INTO videos (title, description, video_url, thumbnail_url, duration, category)
VALUES (
  'Amazing Action Scene',
  'Epic fight sequence from blockbuster movie',
  'https://your-video-url.mp4',
  'https://your-thumbnail.jpg',
  300,
  'action'
);
```

## 🐛 Common Issues

### "Cannot connect to Supabase"
- ✅ Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- ✅ Verify Supabase project is active
- ✅ Check internet connection

### "Authentication failed"
- ✅ Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- ✅ Check `JWT_SECRET` is configured
- ✅ Ensure email/password are correct

### "Videos not loading"
- ✅ Run database schema (`database/schema.sql`)
- ✅ Check videos table has data
- ✅ Verify `is_active = true` for videos

### "Build errors"
- ✅ Run `npm install` again
- ✅ Delete `.next` folder and rebuild
- ✅ Check Node.js version (18+)

## 📱 Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads
- [ ] Videos display correctly
- [ ] Video watching records earnings
- [ ] Balance updates after watching
- [ ] Daily limit enforces correctly
- [ ] Withdrawal request works
- [ ] Withdrawal history displays

## 🚀 Ready for Production?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

## 💡 Tips

1. **Use Test Mode**: Always test with Stripe test keys first
2. **Monitor Logs**: Check Vercel logs for errors
3. **Database Backups**: Enable Supabase automatic backups
4. **Rate Limiting**: Implement for production
5. **Video CDN**: Use CDN for video delivery in production

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

## 🆘 Need Help?

- 📧 Email: bilalsha03255@gmail.com
- 📖 Check [README.md](./README.md) for detailed info
- 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment

---

**Happy Coding! 🎉**